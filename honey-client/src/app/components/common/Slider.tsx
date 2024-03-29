import styled from '@emotion/styled';
import { rem } from 'polished';
import React from 'react';
import { useCarousel } from '~/hooks/useCarousel';

interface BlockProps {
  itemWidth: number;
  itemCount: number;
}

interface Props extends BlockProps {
  children: React.ReactNode;
}

function Slider({ children, itemWidth, itemCount }: Props) {
  const { scrollRef, handleMouseDown, handleMouseUp, handleMouseLeave, handleMouseMove } =
    useCarousel();

  return (
    <Block
      ref={scrollRef}
      onMouseUp={handleMouseUp}
      onMouseDown={handleMouseDown}
      onMouseLeave={handleMouseLeave}
      onMouseMove={handleMouseMove}
    >
      <StyledSlider itemWidth={itemWidth} itemCount={itemCount}>
        {children}
      </StyledSlider>
    </Block>
  );
}

const Block = styled.div`
  overflow: hidden;
`;

const StyledSlider = styled.div<BlockProps>`
  width: ${(props) => `calc((${props.itemWidth}px + 16px) * ${props.itemCount} - 16px)`};
  display: flex;
  align-items: center;
  gap: ${rem(16)};
`;

export default Slider;
