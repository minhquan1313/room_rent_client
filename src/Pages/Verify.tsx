import MyButton from "@/Components/MyButton";
import ServerErrorResponse from "@/Components/ServerResponse/ServerErrorResponse";
import { emailVerify } from "@/services/sendEmailVerify";
import logger from "@/utils/logger";
import { pageTitle } from "@/utils/pageTitle";
import { Result, Spin } from "antd";
import classNames from "classnames";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSearchParams } from "react-router-dom";

function Verify() {
  const { t } = useTranslation();

  pageTitle(t("page name.Verify"));

  const [query] = useSearchParams();
  const [success, setSuccess] = useState<boolean>();
  const [error, setError] = useState<unknown>();
  const submitted = useRef(false);

  const verifyEmail = async (code: string) => {
    setSuccess(undefined);

    try {
      const d = await emailVerify(code);

      logger(`🚀 ~ verifyEmail ~ d:`, d);
      setSuccess(true);
    } catch (error: any) {
      logger(`🚀 ~ verifyEmail ~ error:`, error);

      setError((error as any)?.response?.data);

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
  }, []);
  return (
    <div className="mx-auto my-auto h-full items-center">
      <Spin size="large" spinning={success === undefined}>
        <Result
          status={success === true ? "success" : "error"}
          title={
            success === true
              ? t("Extra.Verify successfully!")
              : t("Extra.Verify failure!")
          }
          subTitle={success === false && <ServerErrorResponse errors={error} />}
          extra={
            success === true && (
              <MyButton type="primary" to="/">
                {t("Extra.Go back home")}
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
