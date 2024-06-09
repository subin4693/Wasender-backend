const {
    handleSetContacts,
    handleGetContacts,
    handleDeleteContacts,
    handleSendMsg,
    handleSetDevices,
    handleGetDevices,
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
    handleSignUp,
    handleSignin,
} = require("../controllers");
const { verifyToken } = require("../middleware");

const router = require("express").Router();

// Auth
router.post("/signup", handleSignUp);
router.post("/signin", handleSignin);

//devices
router.post("/setdevice", verifyToken, handleSetDevices);
router.post("/getdevice", verifyToken, handleGetDevices);
router.post("/qrcode", handleQrCode);
router.post("/instance", handleInstance);
router.post("/instancechange", handleInstanceChange);
router.post("/instancedetails", handleInstanceDetails);
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
//
router.post("/ultramsgwebhook", ultramsgwebhook);
router.post("/schsendmsg", schedulerSave);

module.exports = router;
