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

import { useState } from "react";
// import UploadDialog from "./UploadDialog";
import ApiClient from "../../services/apiClient";

const PolicyGenerator = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [prompt, setPrompt] = useState<string>("");
  const [generateTemplate, setGenerateTemplate] = useState(false);
  const [templateVisible, setTemplateVisible] = useState(false);
  const [templateData, setTemplateData] = useState("");
  const [isEditTemplateData, setIsEditTemplateData] = useState(false);

  const [_, setIsUploadDialogOpen] = useState(false);
  // const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  // const [selectedCloud, setSelectedCloud] = useState("");
  // const [selectedAccount, setSelectedAccount] = useState("");

  // console.log("prompt out", prompt);

  const handleGenerateTemplate = async () => {
    setLoading(true);
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
      console.log("Raw response", response);
      console.log("Raw response body", response.body);
      let body = Array.isArray(response.body)
        ? response.body
        : response.body
        ? JSON.parse(response.body)
        : [];

      console.log("Parsed body in GT:", body);
      setTemplateData(body.response || "No template generated");
      setGenerateTemplate(true);
      setTemplateVisible(true);
    } catch (error) {
      console.error("Error fetching template:", error);
      setTemplateData("Failed to fetch template. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      gap={4}
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
        onChange={(e) => setPrompt(e.target.value)}
        variant="outlined"
        placeholder="Describe the policy you want to create..."
        fullWidth
        multiline
        minRows={1}
        maxRows={11}
        required
      />
      <Button
        onClick={handleGenerateTemplate}
        disabled={prompt === ""}
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

      {generateTemplate && !loading && (
        <Box
          width="100%"
          p={3}
          border="2px solid #8A2BE2"
          borderRadius={3}
          display="flex"
          flexDirection="column"
          gap={2}
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
                      onClick={() => setIsEditTemplateData(false)}
                    >
                      Save
                    </Button>
                  ) : (
                    <Button
                      variant="outlined"
                      onClick={() => setIsEditTemplateData(true)}
                      startIcon={<EditNoteOutlinedIcon />}
                    >
                      Edit
                    </Button>
                  )}

                  <Button
                    variant="contained"
                    startIcon={<FileUploadOutlinedIcon />}
                    onClick={() => setIsUploadDialogOpen(true)}
                  >
                    Upload
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
      {/* <UploadDialog
        isOpen={isUploadDialogOpen}
        onClose={() => setIsUploadDialogOpen(false)}
        selectedCloud={selectedCloud}
        setSelectedCloud={setSelectedCloud}
        selectedAccount={selectedAccount}
        setSelectedAccount={setSelectedAccount}
      /> */}
    </Box>
  );
};

export default PolicyGenerator;
