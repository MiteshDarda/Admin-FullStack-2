import LeaderShipTable from "./LeaderShipTable";

const Leadership = () => {


  return (
    <>
      <div className="p-[2rem] bg-gray-100 mx-0">
        <div className="flex justify-between">
          <h1 className="text-[32px] my-[1rem] font-bold">Leadership</h1>
        </div>
      </div>
      <div className="p-8 bg-gray-100">
        <LeaderShipTable />
      </div>
    </>
  );
};
export default Leadership;
