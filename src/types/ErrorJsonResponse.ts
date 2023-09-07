export type ErrorJsonResponse = {
  success: boolean;
  error: {
    msg: string;
    path?: string;
  }[];
  code: number;
};

// let z = (): (
//   | {
//       type: string;
//       value: string;
//       msg: string;
//       path: string;
//       location: string;
//     }
//   | {
//       type: string;
//       value: number;
//       msg: string;
//       path: string;
//       location: string;
//     }
// )[] => [
//   {
//     type: "field",
//     value: "binh",
//     msg: "Tên người dùng từ 6 kí tự trở lên",
//     path: "username",
//     location: "body",
//   },
//   {
//     type: "field",
//     value: "1",
//     msg: "Mật khẩu 6 kí tự trở lên",
//     path: "password",
//     location: "body",
//   },
//   {
//     type: "field",
//     value: 889379139,
//     msg: "Số điện thoại đã tồn tại",
//     path: "tell",
//     location: "body",
//   },
// ];
