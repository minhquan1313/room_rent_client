import MyButton from "@/Components/MyButton";
import { emailVerify } from "@/services/sendEmailVerify";
import { pageTitle } from "@/utils/pageTitle";
import { Result, Spin } from "antd";
import classNames from "classnames";
import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";

function Verify() {
  pageTitle("Xác thực");

  const [query] = useSearchParams();
  const [success, setSuccess] = useState<boolean>();
  const [error, setError] = useState<string>();
  const submitted = useRef(false);

  const verifyEmail = async (code: string) => {
    try {
      const d = await emailVerify(code);

      console.log(`🚀 ~ verifyEmail ~ d:`, d);
      setSuccess(true);
    } catch (error: any) {
      console.log(`🚀 ~ verifyEmail ~ error:`, error);

      setError(error?.response?.data?.error?.[0]?.msg);

      setSuccess(false);
    }
  };

  useEffect(() => {
    const type = query.get("type");
    const code = query.get("code");
    if (submitted.current || !type || !code) return;

    switch (type) {
      case "email":
        verifyEmail(code);
        submitted.current = true;
        break;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <div className="mx-auto my-auto h-full items-center">
      <Spin size="large" spinning={success === undefined}>
        <Result
          status={success === true ? "success" : "error"}
          title={
            success === true ? "Xác thực thành công!" : "Xác thực thất bại!"
          }
          subTitle={success === false && error}
          extra={
            success === true && (
              <MyButton type="primary" to="/">
                Quay về trang chủ
              </MyButton>
            )
          }
          className={classNames("transition duration-300", {
            "opacity-0": success === undefined,
            "opacity-100": success !== undefined,
          })}
        />
      </Spin>
    </div>
  );
}

export default Verify;
