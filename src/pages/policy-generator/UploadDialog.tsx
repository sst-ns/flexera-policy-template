import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  MenuItem,
  Select,
  Typography,
} from "@mui/material";
interface UploadDialogProps {
  isOpen: boolean;
  onClose: () => void;
  selectedCloud: string;
  setSelectedCloud: (val: string) => void;
  selectedAccount: string;
  setSelectedAccount: (val: string) => void;
}

const UploadDialog = ({
  isOpen,
  onClose,
  selectedCloud,
  setSelectedCloud,
  selectedAccount,
  setSelectedAccount,
}: UploadDialogProps) => {
  const awsAccounts = [
    { id: "aws-001", name: "AWS Account 1" },
    { id: "aws-002", name: "AWS Account 2" },
  ];

  const azureSubscriptions = [
    { id: "azure-001", name: "Azure Subscription 1" },
    { id: "azure-002", name: "Azure Subscription 2" },
  ];

  const gcpAccounts = [
    { id: "gcp-001", name: "GCP Account 1" },
    { id: "gcp-002", name: "GCP Account 2" },
  ];

  const handleUpload = () => {
    console.log("Uploading to:", selectedCloud, selectedAccount);
    onClose();
  };

  return (
    <Dialog open={isOpen} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle
        sx={{ fontWeight: 600, color: "primary.main", fontSize: "1.25rem" }}
      >
        Select Environment
      </DialogTitle>
      <DialogContent>
        <Typography variant="body2" mb={3} sx={{ color: "gray" }}>
          Choose the cloud platform where you want to deploy your infrastructure
          template.
        </Typography>

        <RadioGroup
          value={selectedCloud}
          onChange={(e) => {
            setSelectedCloud(e.target.value);
            setSelectedAccount("");
          }}
        >
          <FormControlLabel
            value="aws"
            control={<Radio sx={{ color: "orange" }} />}
            label="AWS"
          />
          <FormControlLabel
            value="azure"
            control={<Radio sx={{ color: "dodgerblue" }} />}
            label="Azure"
          />
          <FormControlLabel
            value="gcp"
            control={<Radio sx={{ color: "green" }} />}
            label="GCP"
          />
        </RadioGroup>

        {selectedCloud && (
          <>
            <Typography variant="subtitle2" mt={3} mb={1}>
              {selectedCloud === "aws" && "AWS Account"}
              {selectedCloud === "azure" && "Azure Subscription"}
              {selectedCloud === "gcp" && "GCP Account"}
            </Typography>

            <FormControl fullWidth>
              <Select
                displayEmpty
                value={selectedAccount}
                onChange={(e) => setSelectedAccount(e.target.value)}
              >
                <MenuItem value="" disabled>
                  {selectedCloud === "aws" && "Select AWS Account"}
                  {selectedCloud === "azure" && "Select Azure Subscription"}
                  {selectedCloud === "gcp" && "Select GCP Account"}
                </MenuItem>

                {(selectedCloud === "aws"
                  ? awsAccounts
                  : selectedCloud === "azure"
                  ? azureSubscriptions
                  : gcpAccounts
                ).map((item) => (
                  <MenuItem key={item.id} value={item.id}>
                    {item.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </>
        )}
      </DialogContent>

      <DialogActions sx={{ justifyContent: "space-between", px: 3, py: 2 }}>
        <Button variant="outlined" onClick={onClose}>
          Cancel
        </Button>
        <Button
          variant="contained"
          disabled={!selectedCloud || !selectedAccount}
          onClick={handleUpload}
        >
          Upload Template
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UploadDialog;
