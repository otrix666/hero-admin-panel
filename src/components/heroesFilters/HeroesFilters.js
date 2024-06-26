import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import classNames from "classnames";

import { fetchFilters } from "../heroesFilters/heroesFiltersSlice";
import { activeFilterChanged } from "../heroesFilters/heroesFiltersSlice";
import { selectAll } from "./heroesFiltersSlice";

import store from "../../store";

import Spinner from "../spinner/Spinner";

// Задача для этого компонента:
// Фильтры должны формироваться на основании загруженных данных
// Фильтры должны отображать только нужных героев при выборе
// Активный фильтр имеет класс active

const HeroesFilters = () => {
  const { filtersLoadingStatus, activeFilter } = useSelector(
    (state) => state.filters
  );
  const filters = selectAll(store.getState());

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchFilters());

    // eslint-disable-next-line
  }, []);

  if (filtersLoadingStatus === "loading") {
    return <Spinner />;
  } else if (filtersLoadingStatus === "error") {
    return <h5 className="text-center mt-5">Ошибка загрузки</h5>;
  }

  const renderFilters = (arr) => {
    if (arr.length === 0) {
      return <h5 className="text-center mt-5">Фильтры не найдены</h5>;
    }

    return arr.map(({ filterValue, filterClass, filterName }) => {
      const btnClass = classNames("btn", filterClass, {
        active: filterValue === activeFilter,
      });

      return (
        <button
          key={filterValue}
          id={filterValue}
          className={btnClass}
          onClick={() => dispatch(activeFilterChanged(filterValue))}
        >
          {filterName}
        </button>
      );
    });
  };

  const elements = renderFilters(filters);

  return (
    <div className="card shadow-lg mt-4">
      <div className="card-body">
        <p className="card-text">Отфильтруйте героев по элементам</p>
        <div className="btn-group">{elements}</div>
      </div>
    </div>
  );
};

export default HeroesFilters;
