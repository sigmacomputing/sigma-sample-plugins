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
  const { startIter, pauseIter, replayIter } = props;

  return (
    <StyledButtonGroup>
      <Button onClick={startIter}>Start</Button>
      <Button onClick={pauseIter}>Pause</Button>
      <Button onClick={replayIter}>Replay</Button>
    </StyledButtonGroup>
  );
}

export default ButtonGroup;
