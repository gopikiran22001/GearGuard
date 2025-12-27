const validateStateTransition = (currentStatus, newStatus) => {
  const validTransitions = {
    'NEW': ['IN_PROGRESS', 'SCRAP'],
    'IN_PROGRESS': ['REPAIRED', 'SCRAP'],
    'REPAIRED': ['SCRAP'],
    'SCRAP': []
  };

  return validTransitions[currentStatus]?.includes(newStatus) || false;
};

const validateTechnicianAccess = (request, user) => {
  // Technicians can only work on requests assigned to them or their team
  if (user.role === 'TECHNICIAN') {
    const isAssigned = request.assignedTechnician?.toString() === user._id.toString();
    const isTeamMember = request.maintenanceTeam.toString() === user.maintenanceTeam?.toString();
    return isAssigned || isTeamMember;
  }
  return true; // Managers and admins have full access
};

module.exports = { validateStateTransition, validateTechnicianAccess };