// Задача для этого компонента:
// Реализовать создание нового героя с введенными данными. Он должен попадать
// в общее состояние и отображаться в списке + фильтроваться
// Уникальный идентификатор персонажа можно сгенерировать через uiid
// Усложненная задача:
// Персонаж создается и в файле json при помощи метода POST
// Дополнительно:
// Элементы <option></option> желательно сформировать на базе
// данных из фильтров

import { useDispatch, useSelector } from "react-redux";
import {
  Formik,
  Form,
  Field,
  ErrorMessage as FormikErrorMessage,
} from "formik";
import * as Yup from "yup";
import { v4 as uuidv4 } from "uuid";

import { useHttp } from "../../hooks/http.hook";
import { heroUploaded } from "../heroesList/heroesSlice";

import "./heroerAddForm.scss";

const HeroesAddForm = () => {
  const { filters, filtersLoadingStatus } = useSelector((state) => state.filters);
  const { request } = useHttp();
  const dispatch = useDispatch();

  const uploadNewHero = (json) => {
    request("http://localhost:3001/heroes", "POST", json).then((data) =>
      dispatch(heroUploaded(data))
    );
  };

  const renderFilters = (filters, status) => {
    if (status === "loading") {
      return <option>Загрузка элементов</option>;
    } else if (status === "error") {
      return <option>Ошибка загрузки</option>;
    }

    if (filters && filters.length > 0) {
      return filters.map(({ filterValue, filterName }) => {
        // eslint-disable-next-line
        if (filterValue === "all") return;

        return (
          <option key={filterValue} value={filterValue}>
            {filterName}
          </option>
        );
      });
    }
  };

  return (
    <Formik
      initialValues={{
        name: "",
        description: "",
        element: "",
      }}
      validationSchema={Yup.object({
        name: Yup.string()
          .max(20, "Имя должно быть меньше 20 символово!")
          .required("Обязательное поле!"),
        description: Yup.string()
          .min(5, "Описание должно быть не меньше 5 символов!")
          .required("Обязательное поле!"),
        element: Yup.string().required("Обязательное поле!"),
      })}
      onSubmit={(values, { resetForm }) => {
        values = { id: `${uuidv4()}`, ...values };
        const json = JSON.stringify(values);
        uploadNewHero(json);
        resetForm();
      }}
    >
      <Form className="border p-4 shadow-lg rounded">
        <div className="mb-3">
          <label htmlFor="name" className="form-label fs-4">
            Имя нового героя
          </label>
          <Field
            className="form-control"
            id="name"
            name="name"
            type="text"
            placeholder="Как меня зовут?"
          />
        </div>
        <FormikErrorMessage
          component="div"
          name="name"
          className="form__error-text"
        />
        <div className="mb-3">
          <label htmlFor="description" className="form-label fs-4">
            Описание
          </label>
          <Field
            className="form-control"
            id="description"
            name="description"
            as="textarea"
            placeholder="Что я умею?"
            style={{ height: "130px", resize: "none" }}
          />
        </div>
        <FormikErrorMessage
          component="div"
          name="description"
          className="form__error-text"
        />
        <div className="mb-3">
          <label htmlFor="element" className="form-label">
            Выбрать элемент героя
          </label>
          <Field
            className="form-select"
            id="element"
            name="element"
            as="select"
          >
            <option>Я владею элементом...</option>
            {renderFilters(filters, filtersLoadingStatus)}
          </Field>
          <FormikErrorMessage
            component="div"
            name="element"
            className="form__error-text"
          />
        </div>
        <button type="submit" className="btn btn-primary">
          Создать
        </button>
      </Form>
    </Formik>
  );
};

export default HeroesAddForm;
