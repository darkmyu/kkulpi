import styled from '@emotion/styled';
import FavoriteRoundedIcon from '@mui/icons-material/FavoriteRounded';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { rem } from 'polished';
import { deleteRecipe } from '~/apis/recipe';
import { RecipeRead } from '~/apis/types';
import { defaultPictureImage, defaultProfileImage } from '~/static';
import { useModalStore } from '~/stores/modal';
import { useUserStore } from '~/stores/user';
import { colors } from '~/utils/colors';
import { formatNumber, formatePureDate } from '~/utils/format';
import AutoImage from '../../system/AutoImage';

interface Props {
  recipe: RecipeRead;
}

function RecipeViewerHeader({ recipe }: Props) {
  const router = useRouter();
  const { user } = useUserStore();
  const { openModal } = useModalStore();
  const isOwner = recipe.user.id === user?.id;

  const handleClickEdit = () => {
    router.push(`/recipe/edit?id=${recipe.id}`);
  };

  const handleClickDelete = () => {
    openModal({
      title: '레시피 삭제',
      description: '정말 삭제하시겠습니까?',
      onConfirm: async () => {
        await deleteRecipe(recipe.id);
        router.push('/');
      },
    });
  };

  return (
    <Block>
      <Header>
        <Thumbnail>
          <AutoImage src={recipe.thumbnail ?? defaultPictureImage} />
        </Thumbnail>
        <Avatar>
          <LikeCount>
            <FavoriteRoundedIcon />
            <span>{formatNumber(recipe.likeCount)}</span>
          </LikeCount>
          <Image src={recipe.user.picture ?? defaultProfileImage} width={128} height={128} alt="" />
          <Username>{recipe.user.username}</Username>
        </Avatar>
      </Header>
      <Content>
        <Title>{recipe.title}</Title>
        <Description>{recipe.description}</Description>
      </Content>
      <Footer>
        <FooterRow>
          <DateText>{formatePureDate(recipe.createdAt)}</DateText>
          {recipe.isPrivate && (
            <>
              <DotText>·</DotText>
              <Private>비공개</Private>
            </>
          )}
        </FooterRow>
        {isOwner && (
          <FooterRow>
            <ActionText onClick={handleClickEdit}>수정</ActionText>
            <ActionText onClick={handleClickDelete}>삭제</ActionText>
          </FooterRow>
        )}
      </Footer>
    </Block>
  );
}

const Block = styled.div`
  display: flex;
  flex-direction: column;
`;

const Header = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  padding-bottom: ${rem(96)};
`;

const Thumbnail = styled.div`
  display: flex;
  max-height: 300px;

  img {
    border-radius: ${rem(8)};
  }
`;

const Avatar = styled.div`
  position: absolute;
  bottom: 0;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${rem(16)};

  img {
    border: ${rem(8)} solid ${colors.white};
    border-radius: 50%;
  }
`;

const LikeCount = styled.div`
  display: flex;
  align-items: center;
  gap: ${rem(4)};
  padding: ${rem(4)} ${rem(16)};
  background: rgba(0, 0, 0, 0.8);
  border-radius: ${rem(8)};
  color: ${colors.white};
  border: 1px solid ${colors.primary};

  svg {
    width: ${rem(16)};
    color: ${colors.primary};
  }
`;

const Username = styled.span`
  font-size: ${rem(24)};
  font-weight: bold;
  color: ${colors.gray9};
  align-self: center;
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  padding-top: ${rem(80)};
  padding-bottom: ${rem(32)};
  border-bottom: 1px solid ${colors.gray0};
  gap: ${rem(16)};
`;

const Title = styled.span`
  font-size: ${rem(28)};
  font-weight: 500;
  color: ${colors.gray9};
`;

const Description = styled.span`
  font-size: ${rem(16)};
  color: ${colors.gray9};
  white-space: pre-line;
`;

const Footer = styled.div`
  display: flex;
  justify-content: space-between;
  padding-top: ${rem(16)};
`;

const FooterRow = styled.div`
  display: flex;
  align-items: center;
  gap: ${rem(8)};
`;

const DateText = styled.span`
  font-weight: 500;
  font-size: ${rem(14)};
  color: ${colors.gray5};
`;

const DotText = styled.span`
  font-weight: 500;
  font-size: ${rem(14)};
  color: ${colors.gray5};
`;

const ActionText = styled.span`
  cursor: pointer;
  font-weight: 500;
  font-size: ${rem(14)};
  color: ${colors.gray5};

  :hover {
    color: ${colors.gray9};
  }
`;

const Private = styled.div`
  padding: ${rem(2)} ${rem(8)};
  border-radius: ${rem(4)};
  font-size: ${rem(14)};
  color: ${colors.white};
  background: ${colors.gray3};
`;

export default RecipeViewerHeader;
