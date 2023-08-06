import styled from '@emotion/styled';
import { useMutation } from '@tanstack/react-query';
import { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next';
import { useRouter } from 'next/router';
import { rem } from 'polished';
import React from 'react';
import { getRecipe, patchRecipe } from '~/apis/recipe';
import Header from '~/components/common/Header';
import TitleGroup from '~/components/common/TitleGroup';
import ContentLayout from '~/components/layout/ContentLayout';
import MainLayout from '~/components/layout/MainLayout';
import RecipeCourseAddButton from '~/components/recipe/RecipeCourseAddButton';
import RecipeCourseEditor from '~/components/recipe/RecipeCourseEditor';
import RecipeEditor from '~/components/recipe/RecipeEditor';
import RecipeForm from '~/components/recipe/RecipeForm';
import { useRecipeForm } from '~/components/recipe/hooks/useRecipeForm';
import { validateTokenCookie } from '~/utils/cookie';
import { json } from '~/utils/json';
import { redirect } from '~/utils/router';

interface Props extends InferGetServerSidePropsType<typeof getServerSideProps> {}

export const getServerSideProps = async (context: GetServerSidePropsContext) => {
  const { isAuth } = validateTokenCookie(context);
  if (!isAuth) return redirect('/login');

  if (!context.query.id) return redirect('/');
  const id = parseInt(context.query.id as string);
  const recipe = await getRecipe(id);

  return json({ isAuth, recipe });
};

export default function RecipeEditPage({ recipe }: Props) {
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
  } = useRecipeForm(recipe);

  const { mutateAsync: updateRecipe } = useMutation(patchRecipe, {
    onSuccess: () => {
      router.push(`/recipe/${recipe.id}`);
    },
  });

  const onSubmitRecipe = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const isValid = validationForm();
    if (!isValid) return;

    await updateRecipe({
      id: recipe.id,
      request: form,
    });
  };

  return (
    <MainLayout>
      <Header />
      <ContentLayout>
        <RecipeForm onSubmit={onSubmitRecipe} buttonText="레시피 수정하기">
          <TitleGroup title="레시피 정보">
            <RecipeEditor
              title={form.title}
              imagePath={form.thumbnail}
              onClickImage={onClickThumbnail}
              description={form.description}
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
