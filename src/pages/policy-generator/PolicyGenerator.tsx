import {
  Box,
  Button,
  IconButton,
  TextField,
  Typography,
  CircularProgress,
} from "@mui/material";

import EditNoteOutlinedIcon from "@mui/icons-material/EditNoteOutlined";
import FileUploadOutlinedIcon from "@mui/icons-material/FileUploadOutlined";
import KeyboardArrowDownSharpIcon from "@mui/icons-material/KeyboardArrowDownSharp";
import KeyboardArrowUpSharpIcon from "@mui/icons-material/KeyboardArrowUpSharp";
import SaveOutlinedIcon from "@mui/icons-material/SaveOutlined";
import DescriptionTwoToneIcon from "@mui/icons-material/DescriptionTwoTone";
import RuleIcon from "@mui/icons-material/Rule";

import { useState } from "react";
// import UploadDialog from "./UploadDialog";
import ApiClient from "../../services/apiClient";
import { GetObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import { s3Client } from "../../services/s3Client";
import toast from "react-hot-toast";

const PolicyGenerator = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingValidate, setLoadingValidate] = useState<boolean>(false);
  const [loadingSave, setLoadingSave] = useState<boolean>(false);
  const [loadingUpload, setLoadingUpload] = useState<boolean>(false);

  const [prompt, setPrompt] = useState<string>("");
  const [generateTemplate, setGenerateTemplate] = useState(false);
  const [templateVisible, setTemplateVisible] = useState(false);
  const [templateData, setTemplateData] = useState("");
  const [nonTemplateData, setNonTemplateData] = useState("");
  const [errorDetails, setErrorDetails] = useState<string>("");
  const [filePath, setFilePath] = useState<string>("");
  const [isEditTemplateData, setIsEditTemplateData] = useState(false);

  // const [, setIsUploadDialogOpen] = useState(false);
  // const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  // const [selectedCloud, setSelectedCloud] = useState("");
  // const [selectedAccount, setSelectedAccount] = useState("");

  // console.log("prompt out", prompt);

  // get s3 url to generate template
  const handleGenerateTemplate = async () => {
    setLoading(true);
    // const toastId = toast.loading("Generating the template...", {
    //   position: "top-right",
    // });
    try {
      // console.log("prompt", prompt);
      const payload = {
        prompt,
        sessionId: "hello-123",
      };
      const response = await ApiClient.post(
        "lambda_FTG_integrationlambda",
        payload
      );
      // console.log("Generate raw response", response);
      // console.log("Generate raw response body", response.body);
      let body = Array.isArray(response.body)
        ? response.body
        : response.body
        ? JSON.parse(response.body)
        : [];

      console.log("Generate parsed body:", body);
      if (body.template) {
        setFilePath(body.template);

        const templateText = await getTemplate(body.template);
        setNonTemplateData("");
        setErrorDetails("");
        setTemplateData(templateText);
        toast.success("Template Generated successfully", {
          position: "top-right",
        });
        setGenerateTemplate(true);
        setTemplateVisible(true);
      } else {
        // setNonTemplateData(body.response || "No template generated");
        const cleanedResponse = (
          body.response || "No template generated"
        ).replace(/\\n/g, "\n");
        setTemplateData("");
        setErrorDetails("");
        setGenerateTemplate(false);
        setTemplateVisible(false);
        setNonTemplateData(cleanedResponse);
      }
    } catch (error) {
      toast.error("Failed to fetch template. Please try again.", {
        position: "top-right",
      });
      console.error("Error fetching template:", error);
      throw new Error("Failed to fetch template. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // get template from s3
  const getTemplate = async (template: string) => {
    try {
      const [, bucketAndKey] = template.match(/^s3:\/\/(.+)$/) || [];
      if (!bucketAndKey) throw new Error("Invalid S3 URI");

      const [bucket, ...keyParts] = bucketAndKey.split("/");
      const key = keyParts.join("/");

      // console.log("Bucket:", bucket);
      // console.log("Key:", key);

      const command = new GetObjectCommand({ Bucket: bucket, Key: key });
      const response = await s3Client.send(command);

      // console.log("S3 response", response);
      const text = await response.Body?.transformToString();
      // console.log("text", text);
      return text || "";
    } catch (error) {
      console.error("Error fetching template from s3", error);
      throw new Error("Failed to fetch template from s3");
    } finally {
      setLoading(false);
    }
  };

  // save template to s3
  const saveTemplate = async (template: string) => {
    setLoadingSave(true);
    const toastId = toast.loading("Saving the template...", {
      position: "top-right",
    });
    try {
      const [, bucketAndKey] = template.match(/^s3:\/\/(.+)$/) || [];
      if (!bucketAndKey) throw new Error("Invalid S3 URI");

      const [bucket, ...keyParts] = bucketAndKey.split("/");
      const key = keyParts.join("/");

      console.log("Bucket:", bucket);
      console.log("Key:", key);
      const command = new PutObjectCommand({
        Bucket: bucket,
        Key: key,
        Body: templateData,
        // ContentType: "text/plain", // or appropriate MIME type
      });
      const response = await s3Client.send(command);
      console.log("Template saved to S3", response);
      toast.success("Template saved successfully!", {
        id: toastId,
        position: "top-right",
      });
    } catch (error) {
      console.error("Error saving template to S3", error);
      toast.error("Failed to save template. Check console.", {
        id: toastId,
        position: "top-right",
      });
    } finally {
      setIsEditTemplateData(false);
      setLoadingSave(false);
    }
  };

  // For validation
  const handleValidate = async () => {
    setLoadingValidate(true);
    const toastId = toast.loading("Validating the template...", {
      position: "top-right",
    });
    try {
      const payload = {
        action: "validate",
        filePath: filePath || "",
        // bucket: "flexera-ptl-docs",
        // fileName: "130525.pt",
      };
      const response = await ApiClient.post("lambda_FTG_fpt_runner", payload);
      // console.log("validate response", response);
      // console.log("Validate Generate raw response body", response.body);
      const body = Array.isArray(response.body)
        ? JSON.parse(response.body)
        : response.body
        ? JSON.parse(response.body)
        : [];

      console.log("Validate parsed body:", body);
      if (body.errorType) {
        setErrorDetails(body.details);
        toast.error(body.message, {
          position: "top-right",
        });
      } else if (body.success) {
        toast.success("Policy Validated successfully", {
          id: toastId,
          position: "top-right",
        });
        setErrorDetails("");
      } else {
        toast.error(body.message, {
          id: toastId,
          position: "top-right",
        });
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingValidate(false);
    }
  };

  // Upload
  const handleUpload = async () => {
    setLoadingUpload(true);
    const toastId = toast.loading("Uploading the template...", {
      position: "top-right",
    });
    try {
      const payload = {
        action: "upload",
        filePath: filePath,
      };
      const response = await ApiClient.post("lambda_FTG_fpt_runner", payload);
      // console.log("Upload response", response);
      // console.log("Upload generate raw response body", response.body);
      const body = Array.isArray(response.body)
        ? JSON.parse(response.body)
        : response.body
        ? JSON.parse(response.body)
        : [];
      console.log("Upload parsed body:", body);
      if (body.success) {
        toast.success(body.message, {
          id: toastId,
          position: "top-right",
        });
      }
    } catch (error) {
      console.error("Error while uploading:", error);
      toast.error("Error while uploading...", {
        id: toastId,
        position: "top-right",
      });
      throw new Error("Error while uploading");
    } finally {
      setLoadingUpload(false);
    }
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      gap={2}
      sx={{ p: 4 }}
    >
      <Box textAlign="center">
        <Typography variant="h4" fontWeight={500}>
          Policy Generator
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Generate policy templates with natural language
        </Typography>
      </Box>
      <TextField
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleGenerateTemplate();
          }
        }}
        variant="outlined"
        placeholder="Describe the policy you want to create... (Enter to generate, Shift+Enter for line break)"
        fullWidth
        multiline
        minRows={1}
        maxRows={11}
        required
        disabled={loading}
      />

      <Button
        onClick={handleGenerateTemplate}
        disabled={
          prompt === "" || loadingValidate || loadingSave || loadingUpload
        }
        variant="contained"
        sx={{
          textTransform: "none",
          py: 2,
          width: "20%",
          ":disabled": {
            bgcolor: "primary.light",
            color: "white",
          },
        }}
      >
        {loading ? (
          <CircularProgress color="inherit" size={24} />
        ) : (
          "Generate Template"
        )}
      </Button>
      {/* for non template data */}
      {nonTemplateData !== "" && !loading && (
        <Box
          sx={{
            backgroundColor: "#f9fff4ff",
            border: "1px solid #dfffbaff",
            borderRadius: 2,
            padding: 2,
            width: "100%",
            whiteSpace: "pre-wrap",
            fontFamily: "'Courier New', Courier, monospace",
            fontSize: "14px",
            lineHeight: 1.6,
            color: "#0ca114ff",
            boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
            transition: "all 0.3s ease",
          }}
        >
          <Typography sx={{ whiteSpace: "pre-wrap" }}>
            {nonTemplateData}
          </Typography>
        </Box>
      )}

      {/* displaying error details */}
      {errorDetails !== "" && !loading && (
        <Box
          sx={{
            backgroundColor: "#DC3545", // error red background
            border: "1px solid #D32F2F", // darker red border
            borderRadius: 2,
            padding: 2,
            width: "100%",
            whiteSpace: "pre-wrap",
            fontFamily: "'Courier New', Courier, monospace",
            fontSize: "14px",
            lineHeight: 1.6,
            color: "#fff",
            boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
            transition: "all 0.3s ease",
            maxHeight: "400px", // adjust as needed
            overflowY: "auto", // vertical scroll
            overflowX: "hidden",
          }}
        >
          <Typography sx={{ whiteSpace: "pre-wrap" }}>
            {errorDetails}
          </Typography>
        </Box>
      )}

      {/* for non template data */}
      {nonTemplateData !== "" && !loading && (
        <Box
          sx={{
            backgroundColor: "#f9fff4ff",
            border: "1px solid #dfffbaff",
            borderRadius: 2,
            padding: 2,
            width: "100%",
            whiteSpace: "pre-wrap",
            fontFamily: "'Courier New', Courier, monospace",
            fontSize: "14px",
            lineHeight: 1.6,
            color: "#0ca114ff",
            boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
            transition: "all 0.3s ease",
          }}
        >
          <Typography sx={{ whiteSpace: "pre-wrap" }}>
            {nonTemplateData}
          </Typography>
        </Box>
      )}
      {generateTemplate && !loading && (
        <Box
          width="100%"
          p={3}
          border="2px solid #8A2BE2"
          borderRadius={3}
          display="flex"
          flexDirection="column"
          gap={2}
          mt={4}
        >
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Box display="flex" alignItems="center" gap={1}>
              <DescriptionTwoToneIcon color="action" />
              <Typography color="primary" variant="h6">
                Template Preview
              </Typography>
              <Typography variant="body2" color="text.secondary">
                (Draft)
              </Typography>
            </Box>

            <Box display="flex" alignItems="center" gap={1}>
              {templateVisible && (
                <>
                  {isEditTemplateData ? (
                    <Button
                      variant="outlined"
                      startIcon={<SaveOutlinedIcon />}
                      onClick={() => saveTemplate(filePath)}
                      disabled={loadingSave}
                    >
                      {loadingSave ? "Saving..." : "Save"}
                    </Button>
                  ) : (
                    <Button
                      variant="outlined"
                      onClick={() => setIsEditTemplateData(true)}
                      startIcon={<EditNoteOutlinedIcon />}
                      disabled={loadingValidate || loadingUpload}
                    >
                      Edit
                    </Button>
                  )}

                  <Button
                    variant={loadingValidate ? "contained" : "outlined"}
                    startIcon={<RuleIcon />}
                    onClick={handleValidate}
                    disabled={
                      isEditTemplateData ||
                      loadingValidate ||
                      loadingUpload ||
                      loadingSave
                    }
                  >
                    {loadingValidate ? "Validating..." : "Validate"}
                  </Button>
                  <Button
                    variant="contained"
                    startIcon={<FileUploadOutlinedIcon />}
                    // onClick={() => setIsUploadDialogOpen(true)}
                    onClick={handleUpload}
                    disabled={
                      isEditTemplateData ||
                      loadingUpload ||
                      loadingValidate ||
                      loadingSave
                    }
                  >
                    {loadingUpload ? "Uploading..." : "Upload"}
                  </Button>
                </>
              )}
              <IconButton onClick={() => setTemplateVisible((prev) => !prev)}>
                {templateVisible ? (
                  <KeyboardArrowUpSharpIcon />
                ) : (
                  <KeyboardArrowDownSharpIcon />
                )}
              </IconButton>
            </Box>
          </Box>

          {templateVisible && (
            <TextField
              value={templateData}
              multiline
              minRows={12}
              fullWidth
              variant="outlined"
              placeholder="Template content..."
              onChange={(e) => setTemplateData(e.target.value)}
              slotProps={{ input: { readOnly: !isEditTemplateData } }}
              sx={{
                maxHeight: 600,
                overflowY: "auto",
                borderRadius: 2,

                "& .MuiOutlinedInput-root": {
                  bgcolor: isEditTemplateData ? "#fff" : "#fafafa",
                  borderRadius: 2,
                  fontFamily: "'Courier New', Courier, monospace",
                  fontSize: "14px",
                  lineHeight: 1.6,
                  whiteSpace: "pre-wrap",
                  transition: "all 0.3s ease",
                  boxShadow: isEditTemplateData
                    ? "0 0 0 2px rgba(138, 43, 226, 0.2)"
                    : "none",
                  "&:hover fieldset": {
                    borderColor: isEditTemplateData
                      ? "primary.main"
                      : "#bdbdbd",
                  },
                  "& fieldset": {
                    borderWidth: 1.5,
                    borderColor: isEditTemplateData
                      ? "primary.main"
                      : "rgba(0, 0, 0, 0.15)",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "primary.dark",
                    borderWidth: 2,
                  },
                },
              }}
            />
          )}
        </Box>
      )}
      {/*<UploadDialog
        isOpen={isUploadDialogOpen}
        onClose={() => setIsUploadDialogOpen(false)}
        selectedCloud={selectedCloud}
        setSelectedCloud={setSelectedCloud}
        selectedAccount={selectedAccount}
        setSelectedAccount={setSelectedAccount}
      />
      */}
    </Box>
  );
};

export default PolicyGenerator;
