import CreateTaskForm from "./CreateTaskForm";
const CreateTask = () => {
  const data = {
    title: "",
    description: "",
    estimatedTime: new Date().toISOString().split("T")[0],
  };
  return (
    <div className="p-[2rem] bg-gray-100 h-[90vh]">
      <h1 className="text-[32px] my-[1rem] font-bold">Create Task</h1>
      <CreateTaskForm data={data} />
    </div>
  );
};

export default CreateTask;
