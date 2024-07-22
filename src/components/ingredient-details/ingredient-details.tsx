import { FC } from 'react';
import { Preloader } from '../ui/preloader';
import { IngredientDetailsUI } from '../ui/ingredient-details';
import { selectorIngredients } from '../../services/slices/ingredientsSlice';
import { useSelector } from '../../services/store';
import { useParams } from 'react-router-dom';

export const IngredientDetails: FC = () => {
  /** TODO: взять переменную из стора */
  const { selectorIngredientsData } = selectorIngredients;
  const ingredients = useSelector(selectorIngredientsData);

  let { id } = useParams();

  const ingredientData = ingredients.find((data) => data._id === id);

  if (!ingredientData) {
    return <Preloader />;
  }

  return <IngredientDetailsUI ingredientData={ingredientData} />;
};
