const Designation = {
  SUPER_ADMIN: "super_admin",
  ADMIN: "admin",
  MANAGER: "manager",
  LEADER: "leader",
  QA: "qa",
  SEO: "seo",
  THUMBNAIL_DESIGNER: "thumbnail_designer",
  VIDEO_EDITOR: "video_editor",
  SCRIPT_WRITER: "script_writer",
  VOICE_OVER_ASSIST: "voice_over_assist",
  MEMBER: "member",
};

export const usersThatCanBeAssignedTask = [
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
    value: "seo",
    label: "SEO",
  },
  {
    value: "other",
    label: "Other",
  },
  // {
  //   value: "super_admin",
  //   label: "Super Admin",
  // },

  // {
  //   value: "admin",
  //   label: "Admin",
  // },
  // {
  //   value: "manager",
  //   label: "Manager",
  // },
  // {
  //   value: "leader",
  //   label: "Leader",
  // },
  // {
  //   value: "qa",
  //   label: "QA",
  // },
  // {
  //   value: "seo",
  //   label: "SEO",
  // },
];

export const canApprove = (myDesignation) => {
  if (
    myDesignation === Designation.SUPER_ADMIN ||
    myDesignation === Designation.ADMIN ||
    myDesignation === Designation.QA
  )
    return true;
  else return false;
};

export const canChat = (myDesignation, yourDesignation) => {
  if (
    myDesignation === Designation.SUPER_ADMIN ||
    myDesignation === Designation.ADMIN
  ) {
    if (yourDesignation === Designation.MEMBER) return false;
  } else if (myDesignation === Designation.MEMBER) {
    if (
      yourDesignation === Designation.SUPER_ADMIN ||
      yourDesignation === Designation.ADMIN
    )
      return false;
  }

  return true;
};

export const canDelete = (myDesignation, yourDesignation) => {
  if (myDesignation === Designation.SUPER_ADMIN) {
    if (
      yourDesignation === Designation.MEMBER ||
      yourDesignation === Designation.SUPER_ADMIN
    )
      return false;
    else return true;
  } else if (myDesignation === Designation.ADMIN) {
    if (
      yourDesignation === Designation.MEMBER ||
      yourDesignation === Designation.SUPER_ADMIN ||
      yourDesignation === Designation.ADMIN
    )
      return false;
    else return true;
  } else if (myDesignation === Designation.MANAGER) {
    if (
      yourDesignation === Designation.LEADER ||
      yourDesignation === Designation.MEMBER
    )
      return true;
    else return false;
  } else if (myDesignation === Designation.LEADER) {
    if (yourDesignation === Designation.MEMBER) return true;
    else return false;
  }

  return false;
};

export default Designation;
