const {
    handleSetContacts,
    handleGetContacts,
    handleDeleteContacts,
    handleForgetPassword,
    handleSendMsg,
    handleSetDevices,
    handleGetDevices,
    handleDeleteDevice,
    handleEditContacts,
    handleImportBulk,
    handleDuplicates,
    handleLogMessages,
    handleLogChats,
    handleQrCode,
    handleInstance,
    handleInstanceChange,
    handleInstanceDetails,
    handleCreateReply,
    handleGetReply,
    handleDeleteReply,
    handleIdReply,
    handleEditReply,
    ultramsgwebhook,
    schedulerSave,
    //Scheduler
    handleCreateScheduler,
    handleGetSch,
    handleIdSch,
    handleDeleteSch,
    handleEditSch,

    handleSignUp,
    handleSignin,
    handleGetDashboard,
} = require("../controllers");

const router = require("express").Router();

// Auth
router.post("/signup", handleSignUp);
router.post("/signin", handleSignin);
router.post("/forgetpassword", handleForgetPassword);
// Dashboard
router.post("/getdashboard", handleGetDashboard);

//devices
router.post("/setdevice", handleSetDevices);
router.post("/getdevice", handleGetDevices);
router.post("/qrcode", handleQrCode);
router.post("/instance", handleInstance);
router.post("/instancechange", handleInstanceChange);
router.post("/instancedetails", handleInstanceDetails);
router.delete("/devices/delete/:id", handleDeleteDevice);
//
router.post("/setcontacts", handleSetContacts);
router.post("/getcontacts", handleGetContacts);
router.post("/editcontacts", handleEditContacts);
router.post("/delcontacts", handleDeleteContacts);
router.post("/bulknumber", handleImportBulk);
router.post("/sendmsg", handleSendMsg);
router.post("/deldup", handleDuplicates);
router.post("/logmsg", handleLogMessages);
router.post("/logchat", handleLogChats);
//reply
router.post("/getreply", handleGetReply);
router.post("/createreply", handleCreateReply);
router.post("/deletereply", handleDeleteReply);
router.post("/idreply", handleIdReply);
router.post("/editreply", handleEditReply);
//Scheduler
router.post("/ultramsgwebhook", ultramsgwebhook);
//router.post("/schsendmsg", schedulerSave);

router.post("/getsch", handleGetSch);
//router.post("/createsch", schedulerSave);
router.post("/createsch", handleCreateScheduler);

router.post("/deletesch", handleDeleteSch);
router.post("/idsch", handleIdSch);
router.post("/editsch", handleEditSch);

module.exports = router;
