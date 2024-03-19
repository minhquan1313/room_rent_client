import MyButton from "@/Components/MyButton";
import MyContainer from "@/Components/MyContainer";
import logger from "@/utils/logger";
import { Typography } from "antd";
import { ReactNode, memo } from "react";
import { ErrorBoundary, useErrorBoundary } from "react-error-boundary";

export interface MyErrorBoundaryProps {
  children: ReactNode;
}

const MyErrorBoundary = memo(function MyErrorBoundary(props: MyErrorBoundaryProps) {
  const { children } = props;

  return (
    <ErrorBoundary
      onReset={(details) => {
        // Reset the state of your app so the error doesn't happen again
        logger(`~🤖 MyErrorBoundary 🤖~ `, { details });
      }}
      FallbackComponent={ErrorFallback}
    >
      {children}
    </ErrorBoundary>
  );
});

function ErrorFallback() {
  const { resetBoundary } = useErrorBoundary();

  return (
    <MyContainer.Center className="flex flex-col items-center">
      <Typography.Title>Xin lỗi bạn, app lỗi rồi, bạn thử tải lại giúp mình nha :(</Typography.Title>
      <MyButton onClick={resetBoundary}>Bấm nút này nè</MyButton>
    </MyContainer.Center>
  );
}

export default MyErrorBoundary;
