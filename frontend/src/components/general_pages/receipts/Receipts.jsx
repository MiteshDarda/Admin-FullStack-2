import { useState } from "react";
import { motion } from "framer-motion";
import StickyHeadTable from "./Table";

const Receipts = () => {
  const [monthlyTask, setMonthlyTask] = useState(false);
  const [state, setState] = useState(false);
  return (
    <>
      <div className="p-[2rem] bg-gray-100 mx-0 pb-0">
        <div className="flex justify-between">
          <h1 className="text-[32px] my-[1rem] font-bold">Receipts</h1>
          <div>
            <motion.button
              onClick={() => {
                setMonthlyTask(true);
              }}
              initial={{ scale: 0.8 }}
              whileHover={{ scale: 0.9 }}
              whileTap={{ scale: 0.7 }}
              className="bg-[#006eff] text-white font-semibold px-5 py-1 h-12 mt-5 "
            >
              Task Monthly Receipt
            </motion.button>

            <motion.button
              onClick={() => {
                setState(true);
              }}
              initial={{ scale: 0.8 }}
              whileHover={{ scale: 0.9 }}
              whileTap={{ scale: 0.7 }}
              className="bg-[#006eff] text-white font-semibold px-5 py-1 h-12 mt-5 "
            >
              Create Monthly Receipt
            </motion.button>
          </div>
        </div>
      </div>
      <div className="p-8 bg-gray-100">
        <StickyHeadTable state={state} setState={setState} monthlyTask={monthlyTask} setMonthlyTask={setMonthlyTask} />
      </div>
    </>
  );
};
export default Receipts;
