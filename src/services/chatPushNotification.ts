import { VITE_PUBLIC_PUSH_NOTI_KEY } from "@/constants/env";
import { fetcher } from "@/services/fetcher";
import logger from "@/utils/logger";

export const chatPushNotification = {
  async subscribe(): Promise<PushSubscription | undefined> {
    if ("serviceWorker" in navigator && "PushManager" in window) {
      const registration = await new Promise<ServiceWorkerRegistration>((rs) => {
        navigator.serviceWorker.register("/service-worker.js").then((registration) => {
          const { installing, waiting, active } = registration;
          const serviceWorker = installing || waiting || active;

          if (serviceWorker) {
            logger("sw current state", serviceWorker.state);
            if (serviceWorker.state == "activated") {
              logger(`🚀 ~ .then ~ registration:`, registration);

              return rs(registration);
            }

            serviceWorker.addEventListener("statechange", function (e) {
              const { state } = e.target as ServiceWorker;
              if (state == "activated") {
                rs(registration);
              }
            });
          }
        });
      });

      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: VITE_PUBLIC_PUSH_NOTI_KEY,
      });
      return subscription;
    }
  },

  checkSubscribe() {
    return new Promise<PushSubscription | null>((rs) => {
      navigator.serviceWorker.getRegistrations().then((registrations) => {
        if (!registrations.length) return rs(null);

        navigator.serviceWorker.ready.then((reg) => {
          reg.pushManager.getSubscription().then((sub) => {
            if (!sub) {
              // ask user to register for Push
              return rs(null);
            } else {
              // You have subscription, update the database
              return rs(sub);
            }
          });
        });
      });
    });
  },

  checkPermission() {
    return new Promise<boolean | null>((rs) => {
      navigator.permissions
        .query({ name: "notifications" })
        .then((permission) => {
          if (permission.state == "granted") {
            // notifications allowed, gooooo
            rs(true);
          } else if (permission.state == "prompt") {
            // we can ask the user
            rs(null);
          } else if (permission.state == "denied") {
            // notifications were disabled
            rs(false);
          }
        })
        .catch((e) => {
          logger.error(`🚀 ~ checkPermission ~ e:`, e);

          rs(null);
        });
    });
  },

  removeServiceWorker() {
    return new Promise<boolean[]>((rs) => {
      navigator.serviceWorker
        ?.getRegistrations()
        .then((workers) => Promise.all(workers.map((worker) => worker.unregister())))
        .then(rs);
    });
  },

  async makeSubscribeToServer(d: any) {
    await fetcher.post(`/misc/subscribe-push`, d);
  },
};
