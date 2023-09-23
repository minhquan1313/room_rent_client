import { VITE_PUBLIC_PUSH_NOTI_KEY } from "@/constants/env";
import { fetcher } from "@/services/fetcher";

export const chatPushNotification = {
  async subscribe(): Promise<PushSubscription | undefined> {
    // try {
    if ("serviceWorker" in navigator && "PushManager" in window) {
      const registration = await new Promise<ServiceWorkerRegistration>(
        (r2) => {
          navigator.serviceWorker
            .register("/service-worker.js")
            .then((registration) => {
              let serviceWorker;
              if (registration.installing) {
                serviceWorker = registration.installing;
              } else if (registration.waiting) {
                serviceWorker = registration.waiting;
              } else if (registration.active) {
                serviceWorker = registration.active;
              }

              if (serviceWorker) {
                console.log("sw current state", serviceWorker.state);
                if (serviceWorker.state == "activated") {
                  console.log(`🚀 ~ .then ~ registration:`, registration);

                  r2(registration);
                }

                serviceWorker.addEventListener(
                  "statechange",
                  function (e: any) {
                    console.log("sw statechange : ", e.target?.state);
                    if (e.target?.state == "activated") {
                      // use pushManger for subscribing here.
                      console.log(
                        "Just now activated. now we can subscribe for push notification",
                      );

                      r2(registration);
                    }
                  },
                );
              }
            });
        },
      );

      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: VITE_PUBLIC_PUSH_NOTI_KEY,
        // applicationServerKey:
        //   "BKlP2gwfDDdKdZGrJ0zB07NK84h8LwYhDV0ViCYIiV3WUghp1PPGARc159ixrNlpVVVLOTYRLuLvsQ3JuEerM3I",
      });

      return subscription;
    }
  },

  checkSubscribe() {
    return new Promise<PushSubscription | null>((r) => {
      console.log(`Check`);
      navigator.serviceWorker.getRegistrations().then((registrations) => {
        console.log(
          `🚀 ~ navigator.serviceWorker.getRegistrations ~ registrations:`,
          registrations,
        );

        if (!registrations.length) r(null);

        navigator.serviceWorker.ready.then((reg) => {
          console.log(`ready`);

          reg.pushManager.getSubscription().then((sub) => {
            if (!sub) {
              // ask user to register for Push
              r(sub);
            } else {
              // You have subscription, update the database
              r(sub);
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
        .then((r) => {
          console.log(`🚀 ~ .then ~ r:`, r);

          if (r.state == "granted") {
            rs(true);
            // notifications allowed, go wild
          } else if (r.state == "prompt") {
            rs(null);
            // we can ask the user
          } else if (r.state == "denied") {
            rs(false);
            // notifications were disabled
          }
        })
        .catch((e) => {
          console.log(`🚀 ~ checkPermission ~ e:`, e);
          rs(null);
        });
    });
  },

  removeServiceWorker() {
    return new Promise<void>((r) => {
      navigator.serviceWorker
        .getRegistrations()
        .then(async function (serviceWorkers) {
          for await (const i of serviceWorkers) {
            // console.log(`🚀 ~ registration:`, registration);

            await i.unregister();
            console.log(`🚀 ~ forawait ~ i:`, i);
          }
          r();
        });
    });
  },

  async makeSubscribeToServer(d: any) {
    await fetcher.post(`/misc/subscribe-push`, d);
  },
};
