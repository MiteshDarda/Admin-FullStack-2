import Designation from "./designation";

const options = [
  {
    value: "admin",
    label: "Admin",
  },
  {
    value: "manager",
    label: "Manager",
  },
  {
    value: "leader",
    label: "Leader",
  },
  {
    value: "qa",
    label: "QA",
  },
  {
    value: "seo",
    label: "SEO",
  },
  {
    value: "thumbnail_designer",
    label: "Thumbnail Designer",
  },
  {
    value: "video_editor",
    label: "Video Editor",
  },
  {
    value: "script_writer",
    label: "Script Writer",
  },
  {
    value: "voice_over_assist",
    label: "Voice Over Artist",
  },
  {
    value: "member",
    label: "Member",
  },
];

export const canCreateUser = (myDesignation) => {
  if (
    myDesignation === Designation.SUPER_ADMIN ||
    myDesignation === Designation.ADMIN
  )
    return options;
  else if (myDesignation === Designation.MANAGER)
    return [
      {
        value: "leader",
        label: "Leader",
      },
      {
        value: "member",
        label: "Member",
      },
    ];
  else if (myDesignation === Designation.LEADER)
    return [
      {
        value: "member",
        label: "Member",
      },
    ];
  else return [];
};
