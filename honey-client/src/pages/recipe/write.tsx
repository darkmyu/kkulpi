import styled from '@emotion/styled';
import { useMutation } from '@tanstack/react-query';
import { GetServerSidePropsContext } from 'next';
import { useRouter } from 'next/router';
import { rem } from 'polished';
import { withCookie } from '~/apis';
import { postRecipe } from '~/apis/recipe';
import { getProfile } from '~/apis/user';
import Header from '~/components/common/Header';
import TitleGroup from '~/components/common/TitleGroup';
import ContentLayout from '~/components/layout/ContentLayout';
import MainLayout from '~/components/layout/MainLayout';
import RecipeCourseAddButton from '~/components/recipe/RecipeCourseAddButton';
import RecipeCourseEditor from '~/components/recipe/RecipeCourseEditor';
import RecipeEditor from '~/components/recipe/RecipeEditor';
import RecipeForm from '~/components/recipe/RecipeForm';
import { useRecipeForm } from '~/components/recipe/hooks/useRecipeForm';
import { json } from '~/utils/json';
import { redirect } from '~/utils/router';

export const getServerSideProps = async (context: GetServerSidePropsContext) => {
  const user = await withCookie(() => getProfile(), context);
  if (!user) return redirect('/login');
  return json({ user });
};

export default function RecipeWritePage() {
  const router = useRouter();
  const {
    form,
    validationForm,
    onChangeTitle,
    onChangeDescription,
    onChangeContent,
    onClickAddCourse,
    onClickRemoveCourse,
    onClickRemovePicture,
    onClickThumbnail,
    onClickPicture,
  } = useRecipeForm();

  const { mutateAsync: createRecipe } = useMutation(postRecipe, {
    onSuccess: ({ id }) => {
      router.push(`/recipe/${id}`);
    },
  });

  const onSubmitRecipe = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const isValid = validationForm();
    if (!isValid) return;
    await createRecipe(form);
  };

  return (
    <MainLayout>
      <Header />
      <ContentLayout>
        <RecipeForm onSubmit={onSubmitRecipe} buttonText="레시피 작성하기">
          <TitleGroup title="레시피 정보">
            <RecipeEditor
              title={form.title}
              imagePath={form.thumbnail}
              onClickImage={onClickThumbnail}
              onChangeTitle={onChangeTitle}
              onChangeDescription={onChangeDescription}
            />
          </TitleGroup>
          <TitleGroup title="레시피 과정">
            <Block>
              {form.course.map((course, index) => (
                <RecipeCourseEditor
                  key={course.id}
                  step={index + 1}
                  course={course}
                  onChangeContent={onChangeContent}
                  onClickRemove={onClickRemoveCourse}
                  onClickImage={onClickPicture}
                  onClickRemoveImage={onClickRemovePicture}
                />
              ))}
              <RecipeCourseAddButton onClick={onClickAddCourse} />
            </Block>
          </TitleGroup>
        </RecipeForm>
      </ContentLayout>
    </MainLayout>
  );
}

const Block = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${rem(32)};
`;
