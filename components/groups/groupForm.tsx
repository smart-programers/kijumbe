import React, { useState, useEffect } from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import { Text, Button, TextInput, RadioButton, Divider, Menu } from 'react-native-paper';
import { useForm, Controller } from 'react-hook-form';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { renderContributionCycle, renderPaymentArrangement } from '@/actions/Utility';
import { useRouter } from 'expo-router';
import { Post } from '@/actions/helpers';
import toast from '@/actions/toast';

const STEPS = [
  { id: 'msingi', label: 'Msingi' },
  { id: 'michango', label: 'Michango' },
  { id: 'ratiba', label: 'Ratiba' },
  { id: 'thibitisha', label: 'Thibitisha' },
];

export default function GroupForm({hideModal,refreshAction}:any) {
  const [currentStep, setCurrentStep] = useState(0);
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: '',
    purpose: '',
    description: '',
    contributionAmount: '',
    frequency: '',
    memberLimit: '',
    startDate: new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
    }),
    endDate: new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
    }),
    payoutMethod: 'sequential',
  });

  const [datePickerVisible, setDatePickerVisible] = useState(false);
  const [datePickerVisibleEnd, setDatePickerVisibleEnd] = useState(false);
  const [purposeDropdownVisible, setPurposeDropdownVisible] = useState(false);
  const [cycleDropdownVisible, setCycleDropdownVisible] = useState(false);

  const hideDatePicker = () => setDatePickerVisible(false);
  
  const hideDatePickerEnd = () => setDatePickerVisibleEnd(false);
  
  const handleConfirm = (date: Date) => {
    const formattedDate = date.toISOString().split('T')[0]; 
  
    setFormData((prevFormData) => ({
      ...prevFormData,
      startDate: formattedDate,
    }));
  
    setValue('startDate', formattedDate);
    hideDatePicker();
  };
  
  const handleConfirmEndDate = (date: Date) => {
    const formattedDate = date.toISOString().split('T')[0]; 
  
    setFormData((prevFormData) => ({
      ...prevFormData,
      endDate: formattedDate,
    }));
  
    setValue('endDate', formattedDate);
    hideDatePickerEnd();
  };
  const { control, handleSubmit, setValue, reset } = useForm();

  useEffect(() => {
    if (currentStep === 0) {
      reset({
        name: formData.name,
        purpose: formData.purpose,
        description: formData.description,
      });
    } else if (currentStep === 1) {
      reset({
        contributionAmount: formData.contributionAmount,
        frequency: formData.frequency,
        memberLimit: formData.memberLimit,
      });
    } else if (currentStep === 2) {
      reset({
        startDate: formData.startDate,
        endDate: formData.endDate,
        payoutMethod: formData.payoutMethod,
      });
    } else if (currentStep === 3) {
      reset(formData);
    }
  }, [currentStep, reset, formData]);

  const onSubmit = async(data) => {
    const updatedFormData = { ...formData };

    if (currentStep === 0) {
      updatedFormData.name = data.name || '';
      updatedFormData.purpose = data.purpose || '';
      updatedFormData.description = data.description || '';
    } else if (currentStep === 1) {
      updatedFormData.contributionAmount = data.contributionAmount || '';
      updatedFormData.frequency = data.frequency || '';
      updatedFormData.memberLimit = data.memberLimit || '';
    } else if (currentStep === 2) {
      updatedFormData.startDate = data.startDate || 'Thursday, May 1, 2025';
      updatedFormData.payoutMethod = data.payoutMethod || 'Mfuatano wa Kujiunga';
    }

    setFormData(updatedFormData);

    if (currentStep < STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      try {
             await Post("groups", {name: updatedFormData?.name,
                 purpose: updatedFormData?.purpose,
                 description: updatedFormData?.description,
                 contributionAmount: Number(updatedFormData?.contributionAmount),
                 frequency: updatedFormData?.frequency,
                 memberLimit: Number(updatedFormData?.memberLimit),
                 startDate: updatedFormData?.startDate,
                 endDate: updatedFormData?.endDate,
                 payoutMethod: updatedFormData?.payoutMethod,
                status:'active'
             }, "token");
             toast(`${updatedFormData?.name} Created Successfully`, "done", `${updatedFormData?.name} Created Successfully`);
             hideModal();
             refreshAction();
             console.log('Final form submission:', updatedFormData);
           } catch(error) {
             toast(`Failed to Create ${updatedFormData?.name}`, "error", `Failed to Create ${updatedFormData?.name}`);
           }
    }
  };

  const goBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const renderStepIndicator = () => (
    <View style={styles.stepIndicator}>
      {STEPS.map((step, index) => (
        <React.Fragment key={step.id}>
          {index > 0 && (
            <View
              style={[
                styles.stepLine,
                { backgroundColor: index <= currentStep ? '#4CAF50' : '#CCCCCC' }
              ]}
            />
          )}
          <View
            style={[
              styles.stepCircle,
              {
                backgroundColor: index < currentStep ? '#4CAF50' : index === currentStep ? 'white' : 'transparent',
                borderColor: index <= currentStep ? '#4CAF50' : '#CCCCCC'
              }
            ]}
          >
            {index < currentStep ? (
              <MaterialCommunityIcons name="check" size={20} color="white" />
            ) : index === currentStep ? (
              <MaterialCommunityIcons name="pencil" size={20} color="#4CAF50" />
            ) : (
              <Text style={{ color: '#CCCCCC' }}>{index + 1}</Text>
            )}
          </View>
        </React.Fragment>
      ))}
    </View>
  );

  const renderStepLabels = () => (
    <View style={styles.stepLabels}>
      {STEPS.map((step, index) => (
        <Text
          key={step.id}
          style={[
            styles.stepLabel,
            {
              color: index <= currentStep ? '#4CAF50' : '#757575',
              fontWeight: index === currentStep ? 'bold' : 'normal'
            }
          ]}
        >
          {step.label}
        </Text>
      ))}
    </View>
  );

  const renderMsingiStep = () => (
    <View style={styles.formContainer}>
      <View style={styles.headerContainer}>
        <Text style={styles.headerTitle}>Maelezo ya Msingi</Text>
        <Text style={styles.headerSubtitle}>Tafadhali jaza maelezo ya msingi ya kikundi chako</Text>
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>Jina la Kikundi*</Text>
        <Controller
          control={control}
          name="name"
          rules={{ required: true }}
          render={({ field: { onChange, value } }) => (
            <View style={styles.inputWithIcon}>
              <MaterialCommunityIcons name="account-group" size={24} color="#757575" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                value={value}
                onChangeText={(text) => {
                  onChange(text);
                  setFormData({ ...formData, name: text });
                }}
                placeholder="Jina la Kikundi"
                mode="outlined"
              />
            </View>
          )}
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>Madhumuni*</Text>
        <Controller
          control={control}
          name="purpose"
          rules={{ required: true }}
          render={({ field: { onChange, value } }) => (
            <View style={styles.inputWithIcon}>
              <MaterialCommunityIcons name="tag" size={24} color="#757575" style={styles.inputIcon} />
              <View style={styles.dropdownContainer}>
                <Menu
                  visible={purposeDropdownVisible}
                  onDismiss={() => setPurposeDropdownVisible(false)}
                  anchor={
                    <Button
                      mode="outlined"
                      onPress={() => setPurposeDropdownVisible(true)}
                      style={styles.dropdownButton}
                      contentStyle={styles.dropdownButtonContent}
                      icon={() => <MaterialCommunityIcons name="chevron-down" size={24} color="#757575" />}
                      labelStyle={styles.dropdownButtonLabel}
                    >
                      {value || "Chagua Dhumuni"}
                    </Button>
                  }
                >
                  <Menu.Item onPress={() => { onChange("Mchezo wa Pesa"); setPurposeDropdownVisible(false); setFormData({ ...formData, purpose: "Mchezo wa Pesa" }); }} title="Mchezo wa Pesa" />
                  <Menu.Item onPress={() => { onChange("Mchezo wa Biashara"); setPurposeDropdownVisible(false); setFormData({ ...formData, purpose: "Mchezo wa Biashara" }); }} title="Mchezo wa Biashara" />
                  <Menu.Item onPress={() => { onChange("Mchezo wa Gari"); setPurposeDropdownVisible(false); setFormData({ ...formData, purpose: "Mchezo wa Gari" }); }} title="Mchezo wa Gari" />
                  <Menu.Item onPress={() => { onChange("Mchezo wa Simu"); setPurposeDropdownVisible(false); setFormData({ ...formData, purpose: "Mchezo wa Simu" }); }} title="Mchezo wa Simu" />
                  <Menu.Item onPress={() => { onChange("Mchezo wa Kiwanja"); setPurposeDropdownVisible(false); setFormData({ ...formData, purpose: "Mchezo wa Kiwanja" }); }} title="Mchezo wa Kiwanja" />
                  <Menu.Item onPress={() => { onChange("Mchezo wa Nyumba"); setPurposeDropdownVisible(false); setFormData({ ...formData, purpose: "Mchezo wa Nyumba" }); }} title="Mchezo wa Nyumba" />
                  <Menu.Item onPress={() => { onChange("Mchezo wa Familia"); setPurposeDropdownVisible(false); setFormData({ ...formData, purpose: "Mchezo wa Familia" }); }} title="Mchezo wa Familia" />
                  <Menu.Item onPress={() => { onChange("Nyingine"); setPurposeDropdownVisible(false); setFormData({ ...formData, purpose: "Nyingine" }); }} title="Nyingine" />
                </Menu>
              </View>
            </View>
          )}
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>Maelezo ya Kikundi</Text>
        <Controller
          control={control}
          name="description"
          render={({ field: { onChange, value } }) => (
            <View style={styles.inputWithIcon}>
              <MaterialCommunityIcons name="file-document" size={24} color="#757575" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                value={value}
                onChangeText={(text) => {
                  onChange(text);
                  setFormData({ ...formData, description: text });
                }}
                placeholder="Maelezo ya Kikundi"
                mode="outlined"
                multiline
                numberOfLines={3}
              />
            </View>
          )}
        />
      </View>
    </View>
  );

  const renderMichangoStep = () => (
    <View style={styles.formContainer}>
      <View style={styles.headerContainer}>
        <Text style={styles.headerTitle}>Maelezo ya Michango</Text>
        <Text style={styles.headerSubtitle}>Tafadhali jaza maelezo ya michango ya kikundi chako</Text>
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>Kiasi cha Mchango*</Text>
        <Controller
          control={control}
          name="contributionAmount"
          rules={{ required: true }}
          render={({ field: { onChange, value } }) => (
            <View style={styles.inputWithIcon}>
              <MaterialCommunityIcons name="currency-usd" size={24} color="#757575" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                value={value}
                onChangeText={(text) => {
                  onChange(text);
                  setFormData({ ...formData, contributionAmount: text });
                }}
                placeholder="TZS 258"
                mode="outlined"
                keyboardType="numeric"
              />
            </View>
          )}
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>Mzunguko wa Michango*</Text>
        <Controller
          control={control}
          name="frequency"
          rules={{ required: true }}
          render={({ field: { onChange, value } }) => (
            <View style={styles.inputWithIcon}>
              <MaterialCommunityIcons name="calendar" size={24} color="#757575" style={styles.inputIcon} />
              <View style={styles.dropdownContainer}>
                <Menu
                  visible={cycleDropdownVisible}
                  onDismiss={() => setCycleDropdownVisible(false)}
                  anchor={
                    <Button
                      mode="outlined"
                      onPress={() => setCycleDropdownVisible(true)}
                      style={styles.dropdownButton}
                      contentStyle={styles.dropdownButtonContent}
                      icon={() => <MaterialCommunityIcons name="chevron-down" size={24} color="#757575" />}
                      labelStyle={styles.dropdownButtonLabel}
                    >
                      {renderContributionCycle(value) || "Kila Wiki"}
                    </Button>
                  }
                >
                  <Menu.Item onPress={() => { onChange("daily"); setCycleDropdownVisible(false); setFormData({ ...formData, frequency: "daily" }); }} title="Kila Siku" />
                  <Menu.Item onPress={() => { onChange("weekly"); setCycleDropdownVisible(false); setFormData({ ...formData, frequency: "weekly" }); }} title="Kila Wiki" />
                  <Menu.Item onPress={() => { onChange("biweekly"); setCycleDropdownVisible(false); setFormData({ ...formData, frequency: "biweekly" }); }} title="Kila Baada ya Wiki Mbili" />
                  <Menu.Item onPress={() => { onChange("monthly"); setCycleDropdownVisible(false); setFormData({ ...formData, frequency: "monthly" }); }} title="Kila Mwezi" />
                </Menu>
              </View>
            </View>
          )}
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>Idadi ya Wanachama*</Text>
        <Controller
          control={control}
          name="memberLimit"
          rules={{ required: true }}
          render={({ field: { onChange, value } }) => (
            <View style={styles.inputWithIcon}>
              <MaterialCommunityIcons name="account-group" size={24} color="#757575" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                value={value}
                onChangeText={(text) => {
                  onChange(text);
                  setFormData({ ...formData, memberLimit: text });
                }}
                placeholder="20"
                mode="outlined"
                keyboardType="numeric"
              />
            </View>
          )}
        />
      </View>
    </View>
  );

  const renderRatibaStep = () => (
    <View style={styles.formContainer}>
      <View style={styles.headerContainer}>
        <Text style={styles.headerTitle}>Ratiba ya Kikundi</Text>
        <Text style={styles.headerSubtitle}>Tafadhali jaza maelezo ya ratiba ya kikundi chako</Text>
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>Tarehe ya Kuanza*</Text>
        <Controller
          control={control}
          name="startDate"
          rules={{ required: true }}
          render={({ field: { onChange, value } }) => (
            <View style={styles.inputWithIcon}>
              <MaterialCommunityIcons name="calendar" size={24} color="#757575" style={styles.inputIcon} />
              <View style={styles.dropdownContainer}>
                <Button
                  mode="outlined"
                  onPress={() => setDatePickerVisible(true)}
                  style={styles.dropdownButton}
                  contentStyle={styles.dropdownButtonContent}
                  icon={() => <MaterialCommunityIcons name="chevron-right" size={24} color="#757575" />}
                  labelStyle={styles.dropdownButtonLabel}
                >
                  {value || "Thursday, May 1, 2025"}
                </Button>
                
                <DateTimePickerModal
                  isVisible={datePickerVisible}
                  mode="date"
                  onConfirm={(date) => {
                    onChange(date);
                    handleConfirm(date);
                  }}
                  onCancel={hideDatePicker}
                />
              </View>
            </View>
          )}
        />
      </View>
      
      <View style={styles.inputContainer}>
             <Text style={styles.inputLabel}>Tarehe ya Kumaliza*</Text>
             <Controller
               control={control}
               name="endDate"
               rules={{ required: true }}
               render={({ field: { onChange, value } }) => (
                 <View style={styles.inputWithIcon}>
                   <MaterialCommunityIcons name="calendar" size={24} color="#757575" style={styles.inputIcon} />
                   <View style={styles.dropdownContainer}>
                     <Button
                       mode="outlined"
                       onPress={() => setDatePickerVisibleEnd(true)}
                       style={styles.dropdownButton}
                       contentStyle={styles.dropdownButtonContent}
                       icon={() => <MaterialCommunityIcons name="chevron-right" size={24} color="#757575" />}
                       labelStyle={styles.dropdownButtonLabel}
                     >
                       {value || "Thursday, May 1, 2025"}
                     </Button>
     
                     <DateTimePickerModal
                       isVisible={datePickerVisibleEnd}
                       mode="date"
                       onConfirm={(date) => {
                         onChange(date);
                         handleConfirmEndDate(date);
                       }}
                       onCancel={hideDatePickerEnd}
                     />
                   </View>
                 </View>
               )}
             />
           </View>

      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>Utaratibu wa Malipo*</Text>
        <Controller
          control={control}
          name="payoutMethod"
          rules={{ required: true }}
          render={({ field: { onChange, value } }) => (
            <RadioButton.Group onValueChange={(newValue) => { onChange(newValue); setFormData({ ...formData, payoutMethod: newValue }); }} value={value}>
              <View style={styles.radioOption}>
                <RadioButton value="sequential" color="#4CAF50" />
                <View style={styles.radioTextContainer}>
                  <Text style={styles.radioLabel}>Mfuatano wa Kujiunga</Text>
                  <Text style={styles.radioDescription}>Wanachama hulipwa kulingana na mfuatano wa kujiunga</Text>
                </View>
              </View>
              <Divider />
              <View style={styles.radioOption}>
                <RadioButton value="random" color="#4CAF50" />
                <View style={styles.radioTextContainer}>
                  <Text style={styles.radioLabel}>Bahati Nasibu</Text>
                  <Text style={styles.radioDescription}>Wanachama hulipwa kulingana na bahati nasibu</Text>
                </View>
              </View>
              <Divider />
              <View style={styles.radioOption}>
                <RadioButton value="byNeed" color="#4CAF50" />
                <View style={styles.radioTextContainer}>
                  <Text style={styles.radioLabel}>Kulingana na Mahitaji</Text>
                  <Text style={styles.radioDescription}>Wanachama hulipwa kulingana na mahitaji yao</Text>
                </View>
              </View>
              <Divider />
              <View style={styles.radioOption}>
                <RadioButton value="custom" color="#4CAF50" />
                <View style={styles.radioTextContainer}>
                  <Text style={styles.radioLabel}>Utaratibu Maalum</Text>
                  <Text style={styles.radioDescription}>Wanachama hulipwa kulingana na utaratibu maalum</Text>
                </View>
              </View>
            </RadioButton.Group>
          )}
        />
      </View>
    </View>
  );

  const renderThibitishaStep = () => (
    <View style={styles.formContainer}>
      <View style={styles.headerContainer}>
        <Text style={styles.headerTitle}>Thibitisha Maelezo</Text>
        <Text style={styles.headerSubtitle}>Tafadhali thibitisha maelezo ya kikundi chako kabla ya kuunda</Text>
      </View>

      <View style={styles.summaryContainer}>
        <View style={styles.summarySection}>
          <View style={styles.summaryHeader}>
            <MaterialCommunityIcons name="information-outline" size={20} color="#4CAF50" />
            <Text style={styles.summaryTitle}>Maelezo ya Msingi</Text>
          </View>
          <Divider />
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Jina la Kikundi:</Text>
            <Text style={styles.summaryValue}>{formData.name || "Marafiki Savings"}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Madhumuni:</Text>
            <Text style={styles.summaryValue}>{formData.purpose || "Nyingine"}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Maelezo:</Text>
            <Text style={styles.summaryValue}>{formData.description || "Hdhshshsjsjshs"}</Text>
          </View>
        </View>

        <View style={styles.summarySection}>
          <View style={styles.summaryHeader}>
            <MaterialCommunityIcons name="currency-usd" size={20} color="#4CAF50" />
            <Text style={styles.summaryTitle}>Maelezo ya Michango</Text>
          </View>
          <Divider />
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Kiasi cha Mchango:</Text>
            <Text style={styles.summaryValue}>{formData.contributionAmount || "TZS 258"}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Mzunguko wa Michango:</Text>
            <Text style={styles.summaryValue}>{renderContributionCycle(formData.frequency) || "Kila Wiki"}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Idadi ya Wanachama:</Text>
            <Text style={styles.summaryValue}>{formData.memberLimit || "20"}</Text>
          </View>
        </View>

        <View style={styles.summarySection}>
          <View style={styles.summaryHeader}>
            <MaterialCommunityIcons name="calendar" size={20} color="#4CAF50" />
            <Text style={styles.summaryTitle}>Ratiba</Text>
          </View>
          <Divider />
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Tarehe ya Kuanza:</Text>
            <Text style={styles.summaryValue}>{formData.startDate || "Thursday, May 1, 2025"}</Text>
          </View>
          
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Tarehe ya Kumaliza:</Text>
            <Text style={styles.summaryValue}>{formData.endDate || "Thursday, May 1, 2025"}</Text>
          </View>
          
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Utaratibu wa Malipo:</Text>
            <Text style={styles.summaryValue}>{renderPaymentArrangement(formData.payoutMethod) || "Mfuatano wa Kujiunga"}</Text>
          </View>
        </View>
      </View>

      <View style={styles.warningContainer}>
        <MaterialCommunityIcons name="alert-circle-outline" size={24} color="#FF9800" />
        <Text style={styles.warningText}>
          Kwa kubonyeza "Unda Kikundi", unakubaliana na masharti na kanuni za kundi.
        </Text>
      </View>
    </View>
  );

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 0:
        return renderMsingiStep();
      case 1:
        return renderMichangoStep();
      case 2:
        return renderRatibaStep();
      case 3:
        return renderThibitishaStep();
      default:
        return null;
    }
  };


  const debugText = `Current Step: ${currentStep} of ${STEPS.length - 1}`;

  return (
    <View style={styles.container}>
    
      <Text style={styles.debugText}>{debugText}</Text>
      
      <View style={styles.stepsContainer}>
        {renderStepIndicator()}
        {renderStepLabels()}
      </View>
      
      <ScrollView style={styles.scrollView}>
        {renderCurrentStep()}
      </ScrollView>
      
      <View style={styles.buttonsContainer}>
        {currentStep > 0 && (
          <Button
            mode="outlined"
            onPress={goBack}
            style={styles.backButton}
            labelStyle={styles.backButtonLabel}
          >
            Rudi
          </Button>
        )}
        <Button
          mode="contained"
          onPress={handleSubmit(onSubmit)}
          style={styles.nextButton}
          labelStyle={styles.nextButtonLabel}
        >
          {currentStep === STEPS.length - 1 ? 'Unda Kikundi' : 'Endelea'}
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollView: {
    flex: 1,
  },
  debugText: {
    padding: 10,
    backgroundColor: '#f0f0f0',
    color: '#666',
    fontSize: 12,
  },
  stepsContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  stepIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  stepCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepLine: {
    flex: 1,
    height: 2,
  },
  stepLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  stepLabel: {
    fontSize: 14,
    textAlign: 'center',
    width: '25%',
  },
  formContainer: {
    padding: 16,
  },
  headerContainer: {
    backgroundColor: '#f0f8f0',
    padding: 16,
    borderRadius: 8,
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#666',
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    marginBottom: 8,
    fontWeight: '500',
  },
  inputWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    backgroundColor: 'white',
  },
  dropdownContainer: {
    flex: 1,
  },
  dropdownButton: {
    width: '100%',
    justifyContent: 'space-between',
    borderColor: '#CCCCCC',
    borderWidth: 1,
    backgroundColor: 'white',
  },
  dropdownButtonContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  dropdownButtonLabel: {
    color: 'black',
    marginRight: 'auto',
  },
  radioOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  radioTextContainer: {
    flex: 1,
    marginLeft: 10,
  },
  radioLabel: {
    fontSize: 16,
    fontWeight: '500',
  },
  radioDescription: {
    fontSize: 12,
    color: '#757575',
    marginTop: 4,
  },
  summaryContainer: {
    marginBottom: 20,
  },
  summarySection: {
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    overflow: 'hidden',
  },
  summaryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#F5F5F5',
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  summaryRow: {
    flexDirection: 'row',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  summaryLabel: {
    flex: 1,
    fontSize: 14,
    color: '#757575',
  },
  summaryValue: {
    flex: 1,
    fontSize: 14,
    fontWeight: '500',
  },
  warningContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFF8E1',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  warningText: {
    flex: 1,
    marginLeft: 8,
    fontSize: 12,
    color: '#FF8F00',
  },
  buttonsContainer: {
    flexDirection: 'row',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    backgroundColor: 'white',
  },
  backButton: {
    flex: 1,
    marginRight: 8,
    borderColor: '#4CAF50',
  },
  backButtonLabel: {
    color: '#4CAF50',
  },
  nextButton: {
    flex: 2,
    backgroundColor: '#4CAF50',
  },
  nextButtonLabel: {
    color: 'white',
  },
});