import styled from '@emotion/styled';
import { rem } from 'polished';
import { RecipeCourse } from '~/apis/types';
import TitleGroup from '~/components/common/TitleGroup';
import AutoImage from '~/components/system/AutoImage';
import { defaultPictureImage } from '~/static';
import { colors } from '~/utils/colors';

interface Props {
  step: number;
  course: RecipeCourse;
}

function RecipeCourseItem({ step, course }: Props) {
  return (
    <TitleGroup title={`Step ${step + 1}`}>
      <Block>
        <ImageWrapper>
          <AutoImage src={course.picture ?? defaultPictureImage} />
        </ImageWrapper>
        <Content>{course.content}</Content>
      </Block>
    </TitleGroup>
  );
}

const Block = styled.div`
  display: flex;
  gap: ${rem(32)};
`;

const ImageWrapper = styled.div`
  flex: 1;

  img {
    border-radius: ${rem(8)};
  }
`;

const Content = styled.div`
  flex: 2;
  color: ${colors.gray9};
  font-size: ${rem(18)};
  font-weight: 500;
  white-space: pre-line;
`;

export default RecipeCourseItem;
