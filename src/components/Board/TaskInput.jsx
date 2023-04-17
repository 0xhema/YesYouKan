import React,{useState} from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { useBoards } from "@src/context";

const TaskInput = ({status}) => {
  const { createTask } = useBoards();
  const [Mystatus, setMyStatus] = useState(status);


  const initialValues = {
    title: "",
    description: "",
    subtasks: ['', ''],
    status: Mystatus
  };

  const validate = (values) => {
    const errors = {};

    if (!values.title) {
      errors.title = "Task title is required";
    }

    return errors;
  };

  const handleSubmit = (values, { setSubmitting, resetForm }) => {
    values.status =status
    console.log(values);
    createTask(values);
    setSubmitting(false);
    resetForm();
  };

  return (
    <Formik initialValues={initialValues} validate={validate} onSubmit={handleSubmit}>
      {({ isSubmitting }) => (
        <Form>
          <div className="shadow-main px-4 py-6 rounded-lg bg-white text-black dark:bg-darkGrey dark:text-white">
            <div className="flex items-center">
              <Field
                type="text"
                name="title"
                placeholder="Enter task title"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-mainPurple"
              />
              <button
                type="submit"
                disabled={isSubmitting}
                className="ml-2 py-2 px-4 bg-mainPurple text-white rounded-md focus:outline-none focus:ring-2 focus:ring-mainPurple"
              >
                Add Task
              </button>
            </div>
            <ErrorMessage
              name="title"
              component="div"
              className="text-red-500 text-xs mt-1"
            />
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default TaskInput;
