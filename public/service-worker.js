/* eslint-disable no-undef */
console.log(`Hello from service worker of Room rent client ${new Date().toString()}`);

// export type NotificationPayload = {
//   title: string;
//   body: string;
//   link: string;
// };

function implementWebPush() {
  self.addEventListener("push", (event) => {
    console.log(`🚀 ~ This push event:`, event);
    if (event.data) {
      // console.log("This push event has data: ", event.data.text());
      console.log("This push event has data: ", event.data.json());
    } else {
      console.log("This push event has no data.");
    }

    const data = event.data.json();

    const { title, body, link } = data;

    const options = {
      tag: title,
      title: title,
      body,
      icon: "/vite.svg",
      data: {
        link,
      },
      // icon: "/qr_momo.jpg",
    };

    event.waitUntil(self.registration.showNotification(title, options));
  });

  self.addEventListener("notificationclick", (event) => {
    console.log(`🚀 ~ self.addEventListener ~ event:`, event);

    const clickedNotification = event.notification;
    clickedNotification.close();

    const { link } = clickedNotification.data;

    if (link) {
      clients.openWindow(link);
    }
    // Do something as the result of the notification click

    // const promiseChain = doSomething();
  });
}

implementWebPush();
