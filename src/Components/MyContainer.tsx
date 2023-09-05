import { Col, Row, RowProps } from "antd";
import { ReactNode } from "react";

interface IProps extends RowProps {
  children: ReactNode;
}

function MyContainer({ children, justify = "center", style, ...rest }: IProps) {
  return (
    <Row
      justify={justify}
      style={{ ...style, padding: "20px" }}
      {...rest}>
      <Col
        xs={{ span: 24 }}
        xl={{ span: 20 }}
        // lg={{ span: 24 }}
        xxl={{ span: 18 }}>
        {children}
      </Col>
    </Row>
  );
}

export default MyContainer;
