import Tooltip from "@mui/material/Tooltip";
import getTime, { formatDate } from "../../../utils/getTime";

// import { getTime } from "./getTime";
const MyMessage = (props) => {
  return (
    <div className="flex justify-end w-full my-2">
      <div className="flex items-start gap-2.5">
        {/* <img className="w-8 h-8 rounded-full" src="" alt="Jese image"></img> */}

        <div className="flex flex-col w-full max-w-[320px] leading-1.5 p-4 border-gray-200  rounded-l-xl rounded-br-xl bg-green-400">
          <div className="flex items-center space-x-2 rtl:space-x-reverse ">
            <span className="text-sm font-semibold text-white capitalize">
              {props.person}
            </span>
            <Tooltip title={formatDate(props?.time)}>
              <span className="text-sm font-normal text-gray-900">
                {getTime(props?.time)}
              </span>
            </Tooltip>
          </div>
          <p className="text-sm font-normal py-2.5 text-white">
            {props?.content}
          </p>
        </div>
      </div>
    </div>
  );
};

export default MyMessage;
