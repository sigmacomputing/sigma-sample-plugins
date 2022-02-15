import React from "react";
import styled from "@emotion/styled";

const Button = styled("button")`
  background-color: light-gray;
  color: -internal-light-dark;
  font-size: 12px;
  padding: 8px 8px;
  border-radius: 5px;
  margin: 10px 5px;
`;

const StyledButtonGroup = styled.div`
  display: flex;
`;

function ButtonGroup(props) {
  const { startIter, pauseIter, replay, setReplay } = props;

  return (
    <StyledButtonGroup>
      <Button onClick={startIter}>start</Button>
      <Button onClick={pauseIter}>pause</Button>
      <Button onClick={() => setReplay(!replay)}>Replay</Button>
    </StyledButtonGroup>
  );
}

export default ButtonGroup;
