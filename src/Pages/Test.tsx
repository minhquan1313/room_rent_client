import { ColProps } from "antd";
import { memo } from "react";

const Test = memo(() => {
  return (
    <div className="group hover:fill-red-300">
      Test
      <C className="group-hover:fill-red-20" />
    </div>
  );
});

function C({ className }: ColProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 85.333 512 341.333"
      className={className}
      fill="currentColor"
    >
      <path d="M196.641 85.337H0v341.326h512V85.337z" />
      <path
        fill="#FFDA44"
        d="m256 157.279 22.663 69.747H352l-59.332 43.106 22.664 69.749L256 296.774l-59.332 43.107 22.664-69.749L160 227.026h73.337z"
      />
    </svg>
  );
}
export default Test;
