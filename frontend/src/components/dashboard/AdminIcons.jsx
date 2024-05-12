import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import BusinessCenterRoundedIcon from "@mui/icons-material/BusinessCenterRounded";
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";
import PeopleRoundedIcon from "@mui/icons-material/PeopleRounded";
import GroupsIcon from "@mui/icons-material/Groups";
import { useLocation, useNavigate } from "react-router-dom";
import { Tooltip } from "@mui/material";

const AdminIcons = () => {
  const navigate = useNavigate();
  const location = useLocation();
  return (
    <List>
      {[
        "Users",
        //  "Designations", "Managers", "Members"
      ].map((text, index) => (
        <ListItem key={text} disablePadding sx={{ display: "block" }}>
          <Tooltip title={text}>
            <ListItemButton
              sx={{
                minHeight: 48,
                justifyContent: open ? "initial" : "center",
                px: 2.5,
              }}
              onClick={() => {
                if (index == 0) navigate("/users");
                else if (index == 1) navigate("/designations");
                else if (index == 2) navigate("/managers");
                else if (index == 3) navigate("/members");
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  mr: open ? 3 : "auto",
                  justifyContent: "center",
                  color: "black",
                }}
              >
                {index === 0 ? (
                  <VerifiedUserIcon
                    sx={{
                      color: `${location.pathname.split("/")[1] === "users" ? "#218aff" : "black"}`,
                    }}
                  />
                ) : (
                  <></>
                )}
                {index === 1 ? (
                  <BusinessCenterRoundedIcon
                    sx={{
                      color: `${location.pathname.split("/")[1] === "designations" ? "#218aff" : "black"}`,
                    }}
                  />
                ) : (
                  <></>
                )}
                {index === 2 ? (
                  <PeopleRoundedIcon
                    sx={{
                      color: `${location.pathname.split("/")[1] === "managers" ? "#218aff" : "black"}`,
                    }}
                  />
                ) : (
                  <></>
                )}
                {index === 3 ? (
                  <GroupsIcon
                    sx={{
                      color: `${location.pathname.split("/")[1] === "members" ? "#218aff" : "black"}`,
                    }}
                  />
                ) : (
                  <></>
                )}
              </ListItemIcon>
              <ListItemText
                primary={text}
                sx={{
                  opacity: open ? 1 : 0,
                  color: `${location.pathname.split("/")[1] === text.toLowerCase() ? "#218aff" : "black"}`,
                }}
              />
            </ListItemButton>
          </Tooltip>
        </ListItem>
      ))}
    </List>
  );
};

export default AdminIcons;
