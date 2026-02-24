import axios from "axios";
import styles from "./Home.module.css";
import { UserContext } from "../../Context/UserContext";
import { useEffect, useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import toast, { Toaster } from "react-hot-toast";
import { initFlowbite } from "flowbite";

export default function Home() {
  let [todoList, setTodoList] = useState([]);
  let [isLoading, setIsLoading] = useState(false);
  let [isLoadingGet, setIsLoadingGet] = useState(false);
  let [isLoadingUpdate, setIsLoadingUpdate] = useState(false);
  let [isLoadingDelete, setIsLoadingDelete] = useState(false);

  let [currentTodo, setCurrentTodo] = useState(null);
  const closeModalRef = useRef(null);

  const schema = z.object({
    title: z
      .string()
      .min(3, "title must be at least 3 chars")
      .max(30, "title must be at most 30 chars"),
    description: z
      .string()
      .min(3, "title must be at least 3 chars")
      .max(300, "title must be at most 300 chars"),
  });

  let {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({ resolver: zodResolver(schema), mode: "onChange" });

  const {
    register: registerEdit,
    handleSubmit: handleSubmitEdit,
    formState: { errors: errorsEdit },
    reset: resetEdit,
  } = useForm({ resolver: zodResolver(schema), mode: "onChange" });

  const addTodos = function (todoData) {
    setIsLoading(true);
    axios
      .post("https://todo-nti.vercel.app/todo/create", todoData, {
        headers: { token: localStorage.getItem("userToken") },
      })
      .then((response) => {
        console.log(response);
        toast.success("Note created successfully");
        reset();
        getTodos();
      })
      .catch((error) => {
        console.log("error", error);
        toast.error(`This didn't work.${error}`);
      })
      .finally(() => setIsLoading(false));
  };

  const getTodos = function () {
    // setIsLoadingGet(true);
    axios
      .get("https://todo-nti.vercel.app/todo/get-all", {
        headers: { token: localStorage.getItem("userToken") },
      })
      .then((response) => {
        setTodoList(response.data.todos);
      })
      .catch((error) => console.log("error", error))
      .finally(() => setIsLoadingGet(false));
  };

  const handleDelete = function (id) {
    setIsLoadingDelete(true);
    axios
      .delete(`https://todo-nti.vercel.app/todo/delete-todo/${id}`, {
        headers: { token: localStorage.getItem("userToken") },
      })
      .then(() => {
        toast.success("Todo deleted successfully");
        getTodos();
      })
      .catch((error) => console.log("error", error))
      .finally(() => setIsLoadingDelete(false));
  };

  const handleUpdate = function (todoData) {
    setIsLoadingUpdate(true);
    axios
      .patch(
        `https://todo-nti.vercel.app/todo/update-todo/${currentTodo._id}`,
        todoData,
        {
          headers: { token: localStorage.getItem("userToken") },
        },
      )
      .then((res) => {
        getTodos();
        toast.success("Todo updated successfully");
        closeModalRef.current.click();
      })
      .catch((error) => console.log("error", error))
      .finally(() => setIsLoadingUpdate(false));
  };

  const openEditModal = (todo) => {
    setCurrentTodo(todo);
  };

  useEffect(() => {
    getTodos();
  }, []);

  useEffect(() => {
    initFlowbite();
  }, [todoList]);

  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />
      {/* Main modal */}
      <div
        id={`crud-modal`}
        tabIndex={-1}
        aria-hidden="true"
        className="hidden overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full"
      >
        <div className="relative p-4 w-full max-w-md max-h-full">
          {/* Modal content */}
          <div className="relative bg-neutral-primary-soft border border-default rounded-base shadow-sm p-4 md:p-6">
            {/* Modal header */}
            <div className="flex items-center justify-between border-b border-default pb-4 md:pb-5">
              <h3 className="text-lg font-medium text-heading">Edit Note</h3>
              <button
                ref={closeModalRef}
                type="button"
                id="close-modal"
                className="text-body bg-transparent hover:bg-neutral-tertiary hover:text-heading rounded-base text-sm w-9 h-9 ms-auto inline-flex justify-center items-center"
                data-modal-hide={`crud-modal`}
              >
                <svg
                  className="w-5 h-5"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  width={24}
                  height={24}
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18 17.94 6M18 18 6.06 6"
                  />
                </svg>
                <span className="sr-only">Close modal</span>
              </button>
            </div>
            {/* Modal body */}
            <form onSubmit={handleSubmitEdit(handleUpdate)}>
              <div className="grid gap-4 grid-cols-2 py-4 md:py-6">
                <div className="col-span-2">
                  <label
                    htmlFor="name"
                    className="block mb-2.5 text-sm font-medium text-heading"
                  >
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    className="bg-neutral-secondary-medium border border-default-medium text-heading text-sm rounded-base focus:ring-brand focus:border-brand block w-full px-3 py-2.5 shadow-xs placeholder:text-body"
                    defaultValue="123"
                    {...registerEdit("title")}
                  />
                  {errorsEdit.title && (
                    <p className="text-sm text-danger">
                      {errorsEdit.title.message}
                    </p>
                  )}
                </div>

                <div className="col-span-2">
                  <label
                    htmlFor="description"
                    className="block mb-2.5 text-sm font-medium text-heading"
                  >
                    Description
                  </label>
                  <textarea
                    id="description"
                    rows={4}
                    className="block bg-neutral-secondary-medium border border-default-medium text-heading text-sm rounded-base focus:ring-brand focus:border-brand block w-full p-3.5 shadow-xs placeholder:text-body"
                    defaultValue="123"
                    {...registerEdit("description")}
                  />
                  {errorsEdit.description && (
                    <p className="text-sm text-danger">
                      {errorsEdit.description.message}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex items-center space-x-4 border-t border-default pt-4 md:pt-6">
                <button
                  type="submit"
                  className="inline-flex items-center  text-white bg-brand hover:bg-brand-strong box-border border border-transparent focus:ring-4 focus:ring-brand-medium shadow-xs font-medium leading-5 rounded-base text-sm px-4 py-2.5 focus:outline-none
                  disabled:cursor-not-allowed disabled:opacity-50"
                  disabled={isLoadingUpdate}
                >
                  Edit
                  {isLoadingUpdate ? (
                    <i className="fa-solid fa-pen-to-square fa-spin ms-2.5"></i>
                  ) : (
                    <i className="fa-solid fa-pen-to-square  ms-2.5"></i>
                  )}
                </button>
                <button
                  data-modal-hide={`crud-modal`}
                  type="button"
                  className="text-body bg-neutral-secondary-medium box-border border border-default-medium hover:bg-neutral-tertiary-medium hover:text-heading focus:ring-4 focus:ring-neutral-tertiary shadow-xs font-medium leading-5 rounded-base text-sm px-4 py-2.5 focus:outline-none"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <form className="max-w-sm mx-auto" onSubmit={handleSubmit(addTodos)}>
        <div className="mb-5">
          <label
            for="visitors"
            className="block mb-2.5 text-sm font-medium text-heading"
          >
            Title
          </label>
          <input
            type="text"
            id="visitors"
            className="bg-neutral-secondary-medium border border-default-medium text-heading text-sm rounded-base focus:ring-brand focus:border-brand block w-full px-2.5 py-2 shadow-xs placeholder:text-body"
            placeholder=""
            {...register("title")}
          />
          {errors.title && (
            <p className="text-sm text-danger">{errors.title.message}</p>
          )}
        </div>
        <div>
          <label
            for="message"
            className="block mb-2.5 text-sm font-medium text-heading"
          >
            Description
          </label>
          <textarea
            id="message"
            rows="4"
            className="bg-neutral-secondary-medium border border-default-medium text-heading text-sm rounded-base focus:ring-brand focus:border-brand block w-full p-3.5 shadow-xs placeholder:text-body"
            placeholder="Write your thoughts here..."
            {...register("description")}
          ></textarea>
          {errors.description && (
            <p className="text-sm text-danger">{errors.description.message}</p>
          )}
        </div>
        <button
          type="submit"
          className="text-white bg-brand box-border border border-transparent hover:bg-brand-strong focus:ring-4 focus:ring-brand-medium shadow-xs font-medium leading-5 rounded-full text-sm px-4 py-2.5 focus:outline-none flex justify-center items-center w-full mt-3 disabled:cursor-not-allowed disabled:opacity-50"
          disabled={isLoading}
        >
          Add Note
          {isLoading ? (
            <i className="fa-regular fa-square-plus fa-spin ms-2.5"></i>
          ) : (
            <i className="fa-regular fa-square-plus  ms-2.5"></i>
          )}
        </button>
      </form>
      {isLoadingGet ? (
        <div className="flex justify-center mt-8">
          <div role="status" className="max-w-lg animate-pulse">
            <div className="h-2.5 bg-neutral-quaternary rounded-full w-48 mb-4"></div>
            <div className="h-2 bg-neutral-quaternary rounded-full max-w-[360px] mb-2.5"></div>
            <div className="h-2 bg-neutral-quaternary rounded-full mb-2.5"></div>
            <div className="h-2 bg-neutral-quaternary rounded-full max-w-[330px] mb-2.5"></div>
            <div className="h-2 bg-neutral-quaternary rounded-full max-w-[300px] mb-2.5"></div>
            <div className="h-2 bg-neutral-quaternary rounded-full max-w-[360px]"></div>
            <span className="sr-only">Loading...</span>
          </div>
        </div>
      ) : (
        <div className="container mx-auto grid grid-cols-4 mt-6 gap-4 ">
          {todoList.map((todoItem) => (
            <div
              key={todoItem._id}
              className="bg-neutral-primary-soft block max-w-sm p-6 border border-default rounded-base shadow-xs"
            >
              <h5 className="mb-3 text-2xl font-semibold tracking-tight text-heading leading-8">
                {todoItem.title}
              </h5>
              <p className="text-body mb-6">{todoItem.description}</p>
              <div>
                {/* Modal toggle */}
                <button
                  data-modal-target={`crud-modal`}
                  data-modal-toggle={`crud-modal`}
                  className="text-white bg-warning box-border border border-transparent hover:bg-warning-strong focus:ring-4 focus:ring-brand-medium shadow-xs font-medium leading-5 rounded-base text-sm px-4 py-2.5 focus:outline-none w-full flex items-center justify-center
                  disabled:cursor-not-allowed disabled:opacity-45"
                  onClick={() => {
                    openEditModal(todoItem);
                  }}
                  type="button"
                >
                  Edit
                </button>
              </div>
              <button
                className="inline-flex items-center justify-center capitalize mt-2 text-white bg-danger box-border border border-transparent hover:bg-danger-strong focus:ring-4 focus:ring-brand-medium shadow-xs font-medium leading-5 rounded-base text-sm px-4 py-2.5 focus:outline-none w-full cursor-pointer"
                onClick={() => handleDelete(todoItem._id)}
              >
                delete
                <i class="fa-regular fa-trash-can ms-2"></i>
              </button>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
