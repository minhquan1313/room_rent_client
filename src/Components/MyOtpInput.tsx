import { ButtonProps, Divider, Input } from "antd";
import OTPInput from "react-otp-input";

type Props = Pick<ButtonProps, "loading"> & {
  size: number;
  value: string;
  onChange(e: string): void;
};

const MyOtpInput = ({ onChange, value, loading, size }: Props) => {
  // const [otp, setOtp] = useState("");

  return (
    <OTPInput
      value={value}
      onChange={onChange}
      numInputs={size}
      inputType="number"
      renderSeparator={<Divider type="vertical"></Divider>}
      renderInput={({ ref, style, ...props }) => (
        <Input
          {...props}
          className="aspect-square text-center [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
          ref={(e) => ref(e?.input ?? null)}
        />
      )}
    />

    //   <MyButton
    //     onClick={onClick}
    //     type="primary"
    //     disabled={otp.length !== size}
    //     block
    //     loading={loading}
    //   >
    //     Xác thực
    //   </MyButton>
    // </Space>
  );
};

export default MyOtpInput;
