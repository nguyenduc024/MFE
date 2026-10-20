// Danh mục 28 nhóm quyền và chi tiết permissions Mifos X trích xuất từ database
export const PERMISSION_CATEGORIES = [
  {
    "id": "accounting",
    "name": "Accounting",
    "permissions": [
      {
        "code": "CREATE_ACCOUNTINGRULE",
        "label": "CREATE ACCOUNTINGRULE"
      },
      {
        "code": "CREATE_FINANCIALACTIVITYACCOUNT",
        "label": "CREATE FINANCIALACTIVITYACCOUNT"
      },
      {
        "code": "CREATE_GLACCOUNT",
        "label": "CREATE GLACCOUNT"
      },
      {
        "code": "CREATE_GLCLOSURE",
        "label": "CREATE GLCLOSURE"
      },
      {
        "code": "CREATE_JOURNALENTRY",
        "label": "CREATE JOURNALENTRY"
      },
      {
        "code": "CREATE_JOURNALENTRY_CHECKER",
        "label": "CREATE JOURNALENTRY CHECKER"
      },
      {
        "code": "DEFINEOPENINGBALANCE_JOURNALENTRY",
        "label": "DEFINEOPENINGBALANCE JOURNALENTRY"
      },
      {
        "code": "DEFINEOPENINGBALANCE_JOURNALENTRY_CHECKER",
        "label": "DEFINEOPENINGBALANCE JOURNALENTRY CHECKER"
      },
      {
        "code": "DELETE_ACCOUNTINGRULE",
        "label": "DELETE ACCOUNTINGRULE"
      },
      {
        "code": "DELETE_FINANCIALACTIVITYACCOUNT",
        "label": "DELETE FINANCIALACTIVITYACCOUNT"
      },
      {
        "code": "DELETE_GLACCOUNT",
        "label": "DELETE GLACCOUNT"
      },
      {
        "code": "DELETE_GLCLOSURE",
        "label": "DELETE GLCLOSURE"
      },
      {
        "code": "EXECUTE_PERIODICACCRUALACCOUNTING",
        "label": "EXECUTE PERIODICACCRUALACCOUNTING"
      },
      {
        "code": "EXECUTEFORSAVINGS",
        "label": "EXECUTEFORSAVINGS"
      },
      {
        "code": "READ_ACCOUNTINGRULE",
        "label": "READ ACCOUNTINGRULE"
      },
      {
        "code": "READ_FINANCIALACTIVITYACCOUNT",
        "label": "READ FINANCIALACTIVITYACCOUNT"
      },
      {
        "code": "READ_GLACCOUNT",
        "label": "READ GLACCOUNT"
      },
      {
        "code": "READ_GLCLOSURE",
        "label": "READ GLCLOSURE"
      },
      {
        "code": "READ_JOURNALENTRY",
        "label": "READ JOURNALENTRY"
      },
      {
        "code": "REVERSE_JOURNALENTRY",
        "label": "REVERSE JOURNALENTRY"
      },
      {
        "code": "UPDATE_ACCOUNTINGRULE",
        "label": "UPDATE ACCOUNTINGRULE"
      },
      {
        "code": "UPDATE_FINANCIALACTIVITYACCOUNT",
        "label": "UPDATE FINANCIALACTIVITYACCOUNT"
      },
      {
        "code": "UPDATE_GLACCOUNT",
        "label": "UPDATE GLACCOUNT"
      },
      {
        "code": "UPDATE_GLCLOSURE",
        "label": "UPDATE GLCLOSURE"
      },
      {
        "code": "UPDATEOPENINGBALANCE_JOURNALENTRY",
        "label": "UPDATEOPENINGBALANCE JOURNALENTRY"
      },
      {
        "code": "UPDATEOPENINGBALANCE_JOURNALENTRY_CHECKER",
        "label": "UPDATEOPENINGBALANCE JOURNALENTRY CHECKER"
      },
      {
        "code": "UPDATERUNNINGBALANCE_JOURNALENTRY",
        "label": "UPDATERUNNINGBALANCE JOURNALENTRY"
      }
    ]
  },
  {
    "id": "account_transfer",
    "name": "Account_transfer",
    "permissions": [
      {
        "code": "CREATE_STANDINGINSTRUCTION",
        "label": "CREATE STANDINGINSTRUCTION"
      },
      {
        "code": "CREATE_STANDINGINSTRUCTION",
        "label": "CREATE STANDINGINSTRUCTION"
      },
      {
        "code": "DELETE_STANDINGINSTRUCTION",
        "label": "DELETE STANDINGINSTRUCTION"
      },
      {
        "code": "DELETE_STANDINGINSTRUCTION",
        "label": "DELETE STANDINGINSTRUCTION"
      },
      {
        "code": "READ_STANDINGINSTRUCTION",
        "label": "READ STANDINGINSTRUCTION"
      },
      {
        "code": "UPDATE_STANDINGINSTRUCTION",
        "label": "UPDATE STANDINGINSTRUCTION"
      },
      {
        "code": "UPDATE_STANDINGINSTRUCTION",
        "label": "UPDATE STANDINGINSTRUCTION"
      }
    ]
  },
  {
    "id": "authorisation",
    "name": "Authorisation",
    "permissions": [
      {
        "code": "CHANGEPWD_USER",
        "label": "CHANGEPWD USER"
      },
      {
        "code": "CREATE_ADHOC",
        "label": "CREATE ADHOC"
      },
      {
        "code": "CREATE_ADHOC_CHECKER",
        "label": "CREATE ADHOC CHECKER"
      },
      {
        "code": "CREATE_ROLE",
        "label": "CREATE ROLE"
      },
      {
        "code": "CREATE_ROLE_CHECKER",
        "label": "CREATE ROLE CHECKER"
      },
      {
        "code": "CREATE_USER",
        "label": "CREATE USER"
      },
      {
        "code": "CREATE_USER_CHECKER",
        "label": "CREATE USER CHECKER"
      },
      {
        "code": "DELETE_ADHOC",
        "label": "DELETE ADHOC"
      },
      {
        "code": "DELETE_ADHOC_CHECKER",
        "label": "DELETE ADHOC CHECKER"
      },
      {
        "code": "DELETE_ROLE",
        "label": "DELETE ROLE"
      },
      {
        "code": "DELETE_ROLE_CHECKER",
        "label": "DELETE ROLE CHECKER"
      },
      {
        "code": "DELETE_USER",
        "label": "DELETE USER"
      },
      {
        "code": "DELETE_USER_CHECKER",
        "label": "DELETE USER CHECKER"
      },
      {
        "code": "DISABLE_ROLE",
        "label": "DISABLE ROLE"
      },
      {
        "code": "DISABLE_ROLE_CHECKER",
        "label": "DISABLE ROLE CHECKER"
      },
      {
        "code": "ENABLE_ROLE",
        "label": "ENABLE ROLE"
      },
      {
        "code": "ENABLE_ROLE_CHECKER",
        "label": "ENABLE ROLE CHECKER"
      },
      {
        "code": "INVALIDATE_TWOFACTOR_ACCESSTOKEN",
        "label": "INVALIDATE TWOFACTOR ACCESSTOKEN"
      },
      {
        "code": "PERMISSIONS_ROLE",
        "label": "PERMISSIONS ROLE"
      },
      {
        "code": "READ_PASSWORD_PREFERENCES",
        "label": "READ PASSWORD PREFERENCES"
      },
      {
        "code": "READ_PERMISSION",
        "label": "READ PERMISSION"
      },
      {
        "code": "READ_ROLE",
        "label": "READ ROLE"
      },
      {
        "code": "READ_USER",
        "label": "READ USER"
      },
      {
        "code": "UPDATE_ADHOC",
        "label": "UPDATE ADHOC"
      },
      {
        "code": "UPDATE_ADHOC_CHECKER",
        "label": "UPDATE ADHOC CHECKER"
      },
      {
        "code": "UPDATE_PASSWORD_PREFERENCES",
        "label": "UPDATE PASSWORD PREFERENCES"
      },
      {
        "code": "UPDATE_PASSWORD_PREFERENCES_CHECKER",
        "label": "UPDATE PASSWORD PREFERENCES CHECKER"
      },
      {
        "code": "UPDATE_ROLE",
        "label": "UPDATE ROLE"
      },
      {
        "code": "UPDATE_ROLE_CHECKER",
        "label": "UPDATE ROLE CHECKER"
      },
      {
        "code": "UPDATE_USER",
        "label": "UPDATE USER"
      },
      {
        "code": "UPDATE_USER_CHECKER",
        "label": "UPDATE USER CHECKER"
      }
    ]
  },
  {
    "id": "cash_mgmt",
    "name": "Cash_mgmt",
    "permissions": [
      {
        "code": "ALLOCATECASHIER_TELLER",
        "label": "ALLOCATECASHIER TELLER"
      },
      {
        "code": "ALLOCATECASHIER_TELLER_CHECKER",
        "label": "ALLOCATECASHIER TELLER CHECKER"
      },
      {
        "code": "ALLOCATECASHTOCASHIER_TELLER",
        "label": "ALLOCATECASHTOCASHIER TELLER"
      },
      {
        "code": "ALLOCATECASHTOCASHIER_TELLER_CHECKER",
        "label": "ALLOCATECASHTOCASHIER TELLER CHECKER"
      },
      {
        "code": "CREATE_TELLER",
        "label": "CREATE TELLER"
      },
      {
        "code": "CREATE_TELLER_CHECKER",
        "label": "CREATE TELLER CHECKER"
      },
      {
        "code": "DELETE_TELLER",
        "label": "DELETE TELLER"
      },
      {
        "code": "DELETE_TELLER_CHECKER",
        "label": "DELETE TELLER CHECKER"
      },
      {
        "code": "DELETECASHIERALLOCATION_TELLER",
        "label": "DELETECASHIERALLOCATION TELLER"
      },
      {
        "code": "DELETECASHIERALLOCATION_TELLER_CHECKER",
        "label": "DELETECASHIERALLOCATION TELLER CHECKER"
      },
      {
        "code": "SETTLECASHFROMCASHIER_TELLER",
        "label": "SETTLECASHFROMCASHIER TELLER"
      },
      {
        "code": "SETTLECASHFROMCASHIER_TELLER_CHECKER",
        "label": "SETTLECASHFROMCASHIER TELLER CHECKER"
      },
      {
        "code": "UPDATE_TELLER",
        "label": "UPDATE TELLER"
      },
      {
        "code": "UPDATE_TELLER_CHECKER",
        "label": "UPDATE TELLER CHECKER"
      },
      {
        "code": "UPDATECASHIERALLOCATION_TELLER",
        "label": "UPDATECASHIERALLOCATION TELLER"
      },
      {
        "code": "UPDATECASHIERALLOCATION_TELLER_CHECKER",
        "label": "UPDATECASHIERALLOCATION TELLER CHECKER"
      }
    ]
  },
  {
    "id": "collection_sheet",
    "name": "Collection_sheet",
    "permissions": [
      {
        "code": "READ_COLLECTIONSHEET",
        "label": "READ COLLECTIONSHEET"
      },
      {
        "code": "SAVE_COLLECTIONSHEET",
        "label": "SAVE COLLECTIONSHEET"
      },
      {
        "code": "UPDATE_COLLECTIONSHEET",
        "label": "UPDATE COLLECTIONSHEET"
      }
    ]
  },
  {
    "id": "configuration",
    "name": "Configuration",
    "permissions": [
      {
        "code": "CREATE_ACCOUNTNUMBERFORMAT",
        "label": "CREATE ACCOUNTNUMBERFORMAT"
      },
      {
        "code": "CREATE_CALENDAR",
        "label": "CREATE CALENDAR"
      },
      {
        "code": "CREATE_CALENDAR_CHECKER",
        "label": "CREATE CALENDAR CHECKER"
      },
      {
        "code": "CREATE_CODE",
        "label": "CREATE CODE"
      },
      {
        "code": "CREATE_CODE_CHECKER",
        "label": "CREATE CODE CHECKER"
      },
      {
        "code": "CREATE_CODEVALUE",
        "label": "CREATE CODEVALUE"
      },
      {
        "code": "CREATE_CODEVALUE_CHECKER",
        "label": "CREATE CODEVALUE CHECKER"
      },
      {
        "code": "CREATE_CREDITBUREAU_CONFIGURATION",
        "label": "CREATE CREDITBUREAU CONFIGURATION"
      },
      {
        "code": "CREATE_CREDITBUREAU_LOANPRODUCT_MAPPING",
        "label": "CREATE CREDITBUREAU LOANPRODUCT MAPPING"
      },
      {
        "code": "CREATE_DATATABLE",
        "label": "CREATE DATATABLE"
      },
      {
        "code": "CREATE_DATATABLE_CHECKER",
        "label": "CREATE DATATABLE CHECKER"
      },
      {
        "code": "CREATE_HOOK",
        "label": "CREATE HOOK"
      },
      {
        "code": "CREATE_ORGANISATIONCREDITBUREAU",
        "label": "CREATE ORGANISATIONCREDITBUREAU"
      },
      {
        "code": "CREATE_REPORT",
        "label": "CREATE REPORT"
      },
      {
        "code": "CREATE_REPORT_CHECKER",
        "label": "CREATE REPORT CHECKER"
      },
      {
        "code": "DELETE_ACCOUNTNUMBERFORMAT",
        "label": "DELETE ACCOUNTNUMBERFORMAT"
      },
      {
        "code": "DELETE_CALENDAR",
        "label": "DELETE CALENDAR"
      },
      {
        "code": "DELETE_CALENDAR_CHECKER",
        "label": "DELETE CALENDAR CHECKER"
      },
      {
        "code": "DELETE_CODE",
        "label": "DELETE CODE"
      },
      {
        "code": "DELETE_CODE_CHECKER",
        "label": "DELETE CODE CHECKER"
      },
      {
        "code": "DELETE_CODEVALUE",
        "label": "DELETE CODEVALUE"
      },
      {
        "code": "DELETE_CODEVALUE_CHECKER",
        "label": "DELETE CODEVALUE CHECKER"
      },
      {
        "code": "DELETE_CREDITREPORT",
        "label": "DELETE CREDITREPORT"
      },
      {
        "code": "DELETE_DATATABLE",
        "label": "DELETE DATATABLE"
      },
      {
        "code": "DELETE_DATATABLE_CHECKER",
        "label": "DELETE DATATABLE CHECKER"
      },
      {
        "code": "DELETE_HOOK",
        "label": "DELETE HOOK"
      },
      {
        "code": "DELETE_REPORT",
        "label": "DELETE REPORT"
      },
      {
        "code": "DELETE_REPORT_CHECKER",
        "label": "DELETE REPORT CHECKER"
      },
      {
        "code": "DEREGISTER_DATATABLE",
        "label": "DEREGISTER DATATABLE"
      },
      {
        "code": "DEREGISTER_DATATABLE_CHECKER",
        "label": "DEREGISTER DATATABLE CHECKER"
      },
      {
        "code": "GET_CREDITREPORT",
        "label": "GET CREDITREPORT"
      },
      {
        "code": "READ_ACCOUNTNUMBERFORMAT",
        "label": "READ ACCOUNTNUMBERFORMAT"
      },
      {
        "code": "READ_AUDIT",
        "label": "READ AUDIT"
      },
      {
        "code": "READ_CACHE",
        "label": "READ CACHE"
      },
      {
        "code": "READ_CALENDAR",
        "label": "READ CALENDAR"
      },
      {
        "code": "READ_CODE",
        "label": "READ CODE"
      },
      {
        "code": "READ_CODEVALUE",
        "label": "READ CODEVALUE"
      },
      {
        "code": "READ_CONFIGURATION",
        "label": "READ CONFIGURATION"
      },
      {
        "code": "READ_CURRENCY",
        "label": "READ CURRENCY"
      },
      {
        "code": "READ_DATATABLE",
        "label": "READ DATATABLE"
      },
      {
        "code": "READ_EXTERNAL_EVENT_CONFIGURATION",
        "label": "READ EXTERNAL EVENT CONFIGURATION"
      },
      {
        "code": "READ_HOOK",
        "label": "READ HOOK"
      },
      {
        "code": "READ_REPORT",
        "label": "READ REPORT"
      },
      {
        "code": "READ_TWOFACTOR_CONFIGURATION",
        "label": "READ TWOFACTOR CONFIGURATION"
      },
      {
        "code": "REGISTER_DATATABLE",
        "label": "REGISTER DATATABLE"
      },
      {
        "code": "REGISTER_DATATABLE_CHECKER",
        "label": "REGISTER DATATABLE CHECKER"
      },
      {
        "code": "SAVE_CREDITREPORT",
        "label": "SAVE CREDITREPORT"
      },
      {
        "code": "UPDATE_ACCOUNTNUMBERFORMAT",
        "label": "UPDATE ACCOUNTNUMBERFORMAT"
      },
      {
        "code": "UPDATE_CACHE",
        "label": "UPDATE CACHE"
      },
      {
        "code": "UPDATE_CALENDAR",
        "label": "UPDATE CALENDAR"
      },
      {
        "code": "UPDATE_CALENDAR_CHECKER",
        "label": "UPDATE CALENDAR CHECKER"
      },
      {
        "code": "UPDATE_CODE",
        "label": "UPDATE CODE"
      },
      {
        "code": "UPDATE_CODE_CHECKER",
        "label": "UPDATE CODE CHECKER"
      },
      {
        "code": "UPDATE_CODEVALUE",
        "label": "UPDATE CODEVALUE"
      },
      {
        "code": "UPDATE_CODEVALUE_CHECKER",
        "label": "UPDATE CODEVALUE CHECKER"
      },
      {
        "code": "UPDATE_CONFIGURATION",
        "label": "UPDATE CONFIGURATION"
      },
      {
        "code": "UPDATE_CONFIGURATION_CHECKER",
        "label": "UPDATE CONFIGURATION CHECKER"
      },
      {
        "code": "UPDATE_CREDITBUREAU_CONFIGURATION",
        "label": "UPDATE CREDITBUREAU CONFIGURATION"
      },
      {
        "code": "UPDATE_CREDITBUREAU_LOANPRODUCT_MAPPING",
        "label": "UPDATE CREDITBUREAU LOANPRODUCT MAPPING"
      },
      {
        "code": "UPDATE_CURRENCY",
        "label": "UPDATE CURRENCY"
      },
      {
        "code": "UPDATE_CURRENCY_CHECKER",
        "label": "UPDATE CURRENCY CHECKER"
      },
      {
        "code": "UPDATE_DATATABLE",
        "label": "UPDATE DATATABLE"
      },
      {
        "code": "UPDATE_DATATABLE_CHECKER",
        "label": "UPDATE DATATABLE CHECKER"
      },
      {
        "code": "UPDATE_EXTERNAL_EVENT_CONFIGURATION",
        "label": "UPDATE EXTERNAL EVENT CONFIGURATION"
      },
      {
        "code": "UPDATE_HOOK",
        "label": "UPDATE HOOK"
      },
      {
        "code": "UPDATE_ORGANISATIONCREDITBUREAU",
        "label": "UPDATE ORGANISATIONCREDITBUREAU"
      },
      {
        "code": "UPDATE_PERMISSION",
        "label": "UPDATE PERMISSION"
      },
      {
        "code": "UPDATE_PERMISSION_CHECKER",
        "label": "UPDATE PERMISSION CHECKER"
      },
      {
        "code": "UPDATE_REPORT",
        "label": "UPDATE REPORT"
      },
      {
        "code": "UPDATE_REPORT_CHECKER",
        "label": "UPDATE REPORT CHECKER"
      },
      {
        "code": "UPDATE_TWOFACTOR_CONFIGURATION",
        "label": "UPDATE TWOFACTOR CONFIGURATION"
      }
    ]
  },
  {
    "id": "datatable",
    "name": "Datatable",
    "permissions": [
      {
        "code": "CREATE_ENTITY_DATATABLE_CHECK",
        "label": "CREATE ENTITY DATATABLE CHECK"
      },
      {
        "code": "DELETE_ENTITY_DATATABLE_CHECK",
        "label": "DELETE ENTITY DATATABLE CHECK"
      },
      {
        "code": "READ_ENTITY_DATATABLE_CHECK",
        "label": "READ ENTITY DATATABLE CHECK"
      },
      {
        "code": "UPDATE_LIKELIHOOD",
        "label": "UPDATE LIKELIHOOD"
      }
    ]
  },
  {
    "id": "externalservices",
    "name": "Externalservices",
    "permissions": [
      {
        "code": "UPDATE_EXTERNALSERVICES",
        "label": "UPDATE EXTERNALSERVICES"
      }
    ]
  },
  {
    "id": "infrastructure",
    "name": "Infrastructure",
    "permissions": [
      {
        "code": "CREATE_ENTITYMAPPING",
        "label": "CREATE ENTITYMAPPING"
      },
      {
        "code": "DELETE_ENTITYMAPPING",
        "label": "DELETE ENTITYMAPPING"
      },
      {
        "code": "READ_IMPORT",
        "label": "READ IMPORT"
      },
      {
        "code": "UPDATE_ENTITYMAPPING",
        "label": "UPDATE ENTITYMAPPING"
      }
    ]
  },
  {
    "id": "interop",
    "name": "Interop",
    "permissions": [
      {
        "code": "CREATE_INTERID",
        "label": "CREATE INTERID"
      },
      {
        "code": "CREATE_INTERQUOTE",
        "label": "CREATE INTERQUOTE"
      },
      {
        "code": "CREATE_INTERREQUEST",
        "label": "CREATE INTERREQUEST"
      },
      {
        "code": "CREATE_INTERTRANSFER",
        "label": "CREATE INTERTRANSFER"
      },
      {
        "code": "DELETE_INTERID",
        "label": "DELETE INTERID"
      },
      {
        "code": "PREPARE_INTERTRANSFER",
        "label": "PREPARE INTERTRANSFER"
      },
      {
        "code": "READ_INTERID",
        "label": "READ INTERID"
      },
      {
        "code": "READ_INTERQUOTE",
        "label": "READ INTERQUOTE"
      },
      {
        "code": "READ_INTERREQUEST",
        "label": "READ INTERREQUEST"
      },
      {
        "code": "READ_INTERTRANSFER",
        "label": "READ INTERTRANSFER"
      },
      {
        "code": "RELEASE_INTERTRANSFER",
        "label": "RELEASE INTERTRANSFER"
      }
    ]
  },
  {
    "id": "investor",
    "name": "Investor",
    "permissions": [
      {
        "code": "CANCEL_ASSET_OWNER_TRANSACTION",
        "label": "CANCEL ASSET OWNER TRANSACTION"
      },
      {
        "code": "CREATE_EXTERNAL_ASSET_OWNER",
        "label": "CREATE EXTERNAL ASSET OWNER"
      }
    ]
  },
  {
    "id": "jobs",
    "name": "Jobs",
    "permissions": [
      {
        "code": "CREATE_REPORTMAILINGJOB",
        "label": "CREATE REPORTMAILINGJOB"
      },
      {
        "code": "DELETE_REPORTMAILINGJOB",
        "label": "DELETE REPORTMAILINGJOB"
      },
      {
        "code": "EXECUTEJOB_SCHEDULER",
        "label": "EXECUTEJOB SCHEDULER"
      },
      {
        "code": "READ_REPORTMAILINGJOB",
        "label": "READ REPORTMAILINGJOB"
      },
      {
        "code": "READ_SCHEDULER",
        "label": "READ SCHEDULER"
      },
      {
        "code": "UPDATE_REPORTMAILINGJOB",
        "label": "UPDATE REPORTMAILINGJOB"
      },
      {
        "code": "UPDATE_SCHEDULER",
        "label": "UPDATE SCHEDULER"
      }
    ]
  },
  {
    "id": "loan_product_attribute",
    "name": "Loan_product_attribute",
    "permissions": [
      {
        "code": "CREATE_EXTERNAL_ASSET_OWNER_LOAN_PRODUCT_ATTRIBUTE",
        "label": "CREATE EXTERNAL ASSET OWNER LOAN PRODUCT ATTRIBUTE"
      },
      {
        "code": "UPDATE_EXTERNAL_ASSET_OWNER_LOAN_PRODUCT_ATTRIBUTE",
        "label": "UPDATE EXTERNAL ASSET OWNER LOAN PRODUCT ATTRIBUTE"
      }
    ]
  },
  {
    "id": "LOAN_PROVISIONING",
    "name": "LOAN_PROVISIONING",
    "permissions": [
      {
        "code": "CREATE_PROVISIONCATEGORY",
        "label": "CREATE PROVISIONCATEGORY"
      },
      {
        "code": "CREATE_PROVISIONCRITERIA",
        "label": "CREATE PROVISIONCRITERIA"
      },
      {
        "code": "CREATE_PROVISIONENTRIES",
        "label": "CREATE PROVISIONENTRIES"
      },
      {
        "code": "CREATE_PROVISIONJOURNALENTRIES",
        "label": "CREATE PROVISIONJOURNALENTRIES"
      },
      {
        "code": "DELETE_PROVISIONCATEGORY",
        "label": "DELETE PROVISIONCATEGORY"
      },
      {
        "code": "DELETE_PROVISIONCRITERIA",
        "label": "DELETE PROVISIONCRITERIA"
      },
      {
        "code": "RECREATE_PROVISIONENTRIES",
        "label": "RECREATE PROVISIONENTRIES"
      },
      {
        "code": "UPDATE_PROVISIONCATEGORY",
        "label": "UPDATE PROVISIONCATEGORY"
      },
      {
        "code": "UPDATE_PROVISIONCRITERIA",
        "label": "UPDATE PROVISIONCRITERIA"
      }
    ]
  },
  {
    "id": "loan_reschedule",
    "name": "Loan_reschedule",
    "permissions": [
      {
        "code": "APPROVE_RESCHEDULELOAN",
        "label": "APPROVE RESCHEDULELOAN"
      },
      {
        "code": "CREATE_RESCHEDULELOAN",
        "label": "CREATE RESCHEDULELOAN"
      },
      {
        "code": "READ_RESCHEDULELOAN",
        "label": "READ RESCHEDULELOAN"
      },
      {
        "code": "REJECT_RESCHEDULELOAN",
        "label": "REJECT RESCHEDULELOAN"
      }
    ]
  },
  {
    "id": "organisation",
    "name": "Organisation",
    "permissions": [
      {
        "code": "ACTIVATE_EMAIL_CAMPAIGN",
        "label": "ACTIVATE EMAIL CAMPAIGN"
      },
      {
        "code": "ACTIVATE_HOLIDAY",
        "label": "ACTIVATE HOLIDAY"
      },
      {
        "code": "ACTIVATE_HOLIDAY_CHECKER",
        "label": "ACTIVATE HOLIDAY CHECKER"
      },
      {
        "code": "ACTIVATE_SMSCAMPAIGN",
        "label": "ACTIVATE SMSCAMPAIGN"
      },
      {
        "code": "CLOSE_EMAIL_CAMPAIGN",
        "label": "CLOSE EMAIL CAMPAIGN"
      },
      {
        "code": "CLOSE_SMSCAMPAIGN",
        "label": "CLOSE SMSCAMPAIGN"
      },
      {
        "code": "CREATE_CHARGE",
        "label": "CREATE CHARGE"
      },
      {
        "code": "CREATE_CHARGE_CHECKER",
        "label": "CREATE CHARGE CHECKER"
      },
      {
        "code": "CREATE_DELINQUENCY_ACTION",
        "label": "CREATE DELINQUENCY ACTION"
      },
      {
        "code": "CREATE_DELINQUENCY_BUCKET",
        "label": "CREATE DELINQUENCY BUCKET"
      },
      {
        "code": "CREATE_DELINQUENCY_RANGE",
        "label": "CREATE DELINQUENCY RANGE"
      },
      {
        "code": "CREATE_EMAIL",
        "label": "CREATE EMAIL"
      },
      {
        "code": "CREATE_EMAIL_CAMPAIGN",
        "label": "CREATE EMAIL CAMPAIGN"
      },
      {
        "code": "CREATE_EMAIL_CAMPAIGN_CHECKER",
        "label": "CREATE EMAIL CAMPAIGN CHECKER"
      },
      {
        "code": "CREATE_EMAIL_CHECKER",
        "label": "CREATE EMAIL CHECKER"
      },
      {
        "code": "CREATE_FUND",
        "label": "CREATE FUND"
      },
      {
        "code": "CREATE_FUND_CHECKER",
        "label": "CREATE FUND CHECKER"
      },
      {
        "code": "CREATE_HOLIDAY",
        "label": "CREATE HOLIDAY"
      },
      {
        "code": "CREATE_HOLIDAY_CHECKER",
        "label": "CREATE HOLIDAY CHECKER"
      },
      {
        "code": "CREATE_LOANPRODUCT",
        "label": "CREATE LOANPRODUCT"
      },
      {
        "code": "CREATE_LOANPRODUCT_CHECKER",
        "label": "CREATE LOANPRODUCT CHECKER"
      },
      {
        "code": "CREATE_OFFICE",
        "label": "CREATE OFFICE"
      },
      {
        "code": "CREATE_OFFICE_CHECKER",
        "label": "CREATE OFFICE CHECKER"
      },
      {
        "code": "CREATE_OFFICETRANSACTION",
        "label": "CREATE OFFICETRANSACTION"
      },
      {
        "code": "CREATE_OFFICETRANSACTION_CHECKER",
        "label": "CREATE OFFICETRANSACTION CHECKER"
      },
      {
        "code": "CREATE_RATE",
        "label": "CREATE RATE"
      },
      {
        "code": "CREATE_RATE_CHECKER",
        "label": "CREATE RATE CHECKER"
      },
      {
        "code": "CREATE_SAVINGSPRODUCT",
        "label": "CREATE SAVINGSPRODUCT"
      },
      {
        "code": "CREATE_SAVINGSPRODUCT_CHECKER",
        "label": "CREATE SAVINGSPRODUCT CHECKER"
      },
      {
        "code": "CREATE_SMS",
        "label": "CREATE SMS"
      },
      {
        "code": "CREATE_SMS_CHECKER",
        "label": "CREATE SMS CHECKER"
      },
      {
        "code": "CREATE_SMSCAMPAIGN",
        "label": "CREATE SMSCAMPAIGN"
      },
      {
        "code": "CREATE_SMSCAMPAIGN_CHECKER",
        "label": "CREATE SMSCAMPAIGN CHECKER"
      },
      {
        "code": "CREATE_STAFF",
        "label": "CREATE STAFF"
      },
      {
        "code": "CREATE_STAFF_CHECKER",
        "label": "CREATE STAFF CHECKER"
      },
      {
        "code": "CREATE_TAXCOMPONENT",
        "label": "CREATE TAXCOMPONENT"
      },
      {
        "code": "CREATE_TAXCOMPONENT_CHECKER",
        "label": "CREATE TAXCOMPONENT CHECKER"
      },
      {
        "code": "CREATE_TAXGROUP",
        "label": "CREATE TAXGROUP"
      },
      {
        "code": "CREATE_TAXGROUP_CHECKER",
        "label": "CREATE TAXGROUP CHECKER"
      },
      {
        "code": "CREATE_TEMPLATE",
        "label": "CREATE TEMPLATE"
      },
      {
        "code": "CREATE_WORKINGCAPITALBREACH",
        "label": "CREATE WORKINGCAPITALBREACH"
      },
      {
        "code": "CREATE_WORKINGCAPITALLOAN",
        "label": "CREATE WORKINGCAPITALLOAN"
      },
      {
        "code": "CREATE_WORKINGCAPITALLOANPRODUCT",
        "label": "CREATE WORKINGCAPITALLOANPRODUCT"
      },
      {
        "code": "CREATE_WORKINGCAPITALNEARBREACH",
        "label": "CREATE WORKINGCAPITALNEARBREACH"
      },
      {
        "code": "DELETE_CHARGE",
        "label": "DELETE CHARGE"
      },
      {
        "code": "DELETE_CHARGE_CHECKER",
        "label": "DELETE CHARGE CHECKER"
      },
      {
        "code": "DELETE_DELINQUENCY_BUCKET",
        "label": "DELETE DELINQUENCY BUCKET"
      },
      {
        "code": "DELETE_DELINQUENCY_RANGE",
        "label": "DELETE DELINQUENCY RANGE"
      },
      {
        "code": "DELETE_EMAIL",
        "label": "DELETE EMAIL"
      },
      {
        "code": "DELETE_EMAIL_CAMPAIGN",
        "label": "DELETE EMAIL CAMPAIGN"
      },
      {
        "code": "DELETE_EMAIL_CAMPAIGN_CHECKER",
        "label": "DELETE EMAIL CAMPAIGN CHECKER"
      },
      {
        "code": "DELETE_EMAIL_CHECKER",
        "label": "DELETE EMAIL CHECKER"
      },
      {
        "code": "DELETE_FUND",
        "label": "DELETE FUND"
      },
      {
        "code": "DELETE_FUND_CHECKER",
        "label": "DELETE FUND CHECKER"
      },
      {
        "code": "DELETE_HOLIDAY",
        "label": "DELETE HOLIDAY"
      },
      {
        "code": "DELETE_HOLIDAY_CHECKER",
        "label": "DELETE HOLIDAY CHECKER"
      },
      {
        "code": "DELETE_LOANPRODUCT",
        "label": "DELETE LOANPRODUCT"
      },
      {
        "code": "DELETE_LOANPRODUCT_CHECKER",
        "label": "DELETE LOANPRODUCT CHECKER"
      },
      {
        "code": "DELETE_OFFICE_CHECKER",
        "label": "DELETE OFFICE CHECKER"
      },
      {
        "code": "DELETE_OFFICETRANSACTION",
        "label": "DELETE OFFICETRANSACTION"
      },
      {
        "code": "DELETE_OFFICETRANSACTION_CHECKER",
        "label": "DELETE OFFICETRANSACTION CHECKER"
      },
      {
        "code": "DELETE_SAVINGSPRODUCT",
        "label": "DELETE SAVINGSPRODUCT"
      },
      {
        "code": "DELETE_SAVINGSPRODUCT_CHECKER",
        "label": "DELETE SAVINGSPRODUCT CHECKER"
      },
      {
        "code": "DELETE_SMS",
        "label": "DELETE SMS"
      },
      {
        "code": "DELETE_SMS_CHECKER",
        "label": "DELETE SMS CHECKER"
      },
      {
        "code": "DELETE_SMSCAMPAIGN",
        "label": "DELETE SMSCAMPAIGN"
      },
      {
        "code": "DELETE_SMSCAMPAIGN_CHECKER",
        "label": "DELETE SMSCAMPAIGN CHECKER"
      },
      {
        "code": "DELETE_STAFF",
        "label": "DELETE STAFF"
      },
      {
        "code": "DELETE_STAFF_CHECKER",
        "label": "DELETE STAFF CHECKER"
      },
      {
        "code": "DELETE_TEMPLATE",
        "label": "DELETE TEMPLATE"
      },
      {
        "code": "DELETE_WORKINGCAPITALBREACH",
        "label": "DELETE WORKINGCAPITALBREACH"
      },
      {
        "code": "DELETE_WORKINGCAPITALLOAN",
        "label": "DELETE WORKINGCAPITALLOAN"
      },
      {
        "code": "DELETE_WORKINGCAPITALLOANPRODUCT",
        "label": "DELETE WORKINGCAPITALLOANPRODUCT"
      },
      {
        "code": "DELETE_WORKINGCAPITALNEARBREACH",
        "label": "DELETE WORKINGCAPITALNEARBREACH"
      },
      {
        "code": "EXECUTE_INLINE_JOB",
        "label": "EXECUTE INLINE JOB"
      },
      {
        "code": "REACTIVATE_EMAIL_CAMPAIGN",
        "label": "REACTIVATE EMAIL CAMPAIGN"
      },
      {
        "code": "REACTIVATE_SMSCAMPAIGN",
        "label": "REACTIVATE SMSCAMPAIGN"
      },
      {
        "code": "READ_BUSINESS_DATE",
        "label": "READ BUSINESS DATE"
      },
      {
        "code": "READ_CHARGE",
        "label": "READ CHARGE"
      },
      {
        "code": "READ_DELINQUENCY_BUCKET",
        "label": "READ DELINQUENCY BUCKET"
      },
      {
        "code": "READ_DELINQUENCY_TAGS",
        "label": "READ DELINQUENCY TAGS"
      },
      {
        "code": "READ_EMAIL",
        "label": "READ EMAIL"
      },
      {
        "code": "READ_EMAIL_CAMPAIGN",
        "label": "READ EMAIL CAMPAIGN"
      },
      {
        "code": "READ_EMAIL_CONFIGURATION",
        "label": "READ EMAIL CONFIGURATION"
      },
      {
        "code": "READ_FIXEDDEPOSITPRODUCT",
        "label": "READ FIXEDDEPOSITPRODUCT"
      },
      {
        "code": "READ_FUND",
        "label": "READ FUND"
      },
      {
        "code": "READ_HOLIDAY",
        "label": "READ HOLIDAY"
      },
      {
        "code": "READ_LOANPRODUCT",
        "label": "READ LOANPRODUCT"
      },
      {
        "code": "READ_OFFICE",
        "label": "READ OFFICE"
      },
      {
        "code": "READ_OFFICETRANSACTION",
        "label": "READ OFFICETRANSACTION"
      },
      {
        "code": "READ_RATE",
        "label": "READ RATE"
      },
      {
        "code": "READ_RATE_CHECKER",
        "label": "READ RATE CHECKER"
      },
      {
        "code": "READ_RECURRINGDEPOSITPRODUCT",
        "label": "READ RECURRINGDEPOSITPRODUCT"
      },
      {
        "code": "READ_SAVINGSPRODUCT",
        "label": "READ SAVINGSPRODUCT"
      },
      {
        "code": "READ_SMS",
        "label": "READ SMS"
      },
      {
        "code": "READ_SMSCAMPAIGN",
        "label": "READ SMSCAMPAIGN"
      },
      {
        "code": "READ_STAFF",
        "label": "READ STAFF"
      },
      {
        "code": "READ_TAXCOMPONENT",
        "label": "READ TAXCOMPONENT"
      },
      {
        "code": "READ_TAXGROUP",
        "label": "READ TAXGROUP"
      },
      {
        "code": "READ_TEMPLATE",
        "label": "READ TEMPLATE"
      },
      {
        "code": "READ_WORKINGCAPITALBREACH",
        "label": "READ WORKINGCAPITALBREACH"
      },
      {
        "code": "READ_WORKINGCAPITALLOAN",
        "label": "READ WORKINGCAPITALLOAN"
      },
      {
        "code": "READ_WORKINGCAPITALLOANPRODUCT",
        "label": "READ WORKINGCAPITALLOANPRODUCT"
      },
      {
        "code": "READ_WORKINGCAPITALNEARBREACH",
        "label": "READ WORKINGCAPITALNEARBREACH"
      },
      {
        "code": "READ_WORKINGDAYS",
        "label": "READ WORKINGDAYS"
      },
      {
        "code": "UPDATE_BATCH_BUSINESS_STEP",
        "label": "UPDATE BATCH BUSINESS STEP"
      },
      {
        "code": "UPDATE_BUSINESS_DATE",
        "label": "UPDATE BUSINESS DATE"
      },
      {
        "code": "UPDATE_CHARGE",
        "label": "UPDATE CHARGE"
      },
      {
        "code": "UPDATE_CHARGE_CHECKER",
        "label": "UPDATE CHARGE CHECKER"
      },
      {
        "code": "UPDATE_DELINQUENCY_BUCKET",
        "label": "UPDATE DELINQUENCY BUCKET"
      },
      {
        "code": "UPDATE_DELINQUENCY_RANGE",
        "label": "UPDATE DELINQUENCY RANGE"
      },
      {
        "code": "UPDATE_DELINQUENCY_TAGS",
        "label": "UPDATE DELINQUENCY TAGS"
      },
      {
        "code": "UPDATE_EMAIL",
        "label": "UPDATE EMAIL"
      },
      {
        "code": "UPDATE_EMAIL_CAMPAIGN",
        "label": "UPDATE EMAIL CAMPAIGN"
      },
      {
        "code": "UPDATE_EMAIL_CAMPAIGN_CHECKER",
        "label": "UPDATE EMAIL CAMPAIGN CHECKER"
      },
      {
        "code": "UPDATE_EMAIL_CHECKER",
        "label": "UPDATE EMAIL CHECKER"
      },
      {
        "code": "UPDATE_EMAIL_CONFIGURATION",
        "label": "UPDATE EMAIL CONFIGURATION"
      },
      {
        "code": "UPDATE_FUND",
        "label": "UPDATE FUND"
      },
      {
        "code": "UPDATE_FUND_CHECKER",
        "label": "UPDATE FUND CHECKER"
      },
      {
        "code": "UPDATE_HOLIDAY",
        "label": "UPDATE HOLIDAY"
      },
      {
        "code": "UPDATE_HOLIDAY_CHECKER",
        "label": "UPDATE HOLIDAY CHECKER"
      },
      {
        "code": "UPDATE_LOANPRODUCT",
        "label": "UPDATE LOANPRODUCT"
      },
      {
        "code": "UPDATE_LOANPRODUCT_CHECKER",
        "label": "UPDATE LOANPRODUCT CHECKER"
      },
      {
        "code": "UPDATE_OFFICE",
        "label": "UPDATE OFFICE"
      },
      {
        "code": "UPDATE_OFFICE_CHECKER",
        "label": "UPDATE OFFICE CHECKER"
      },
      {
        "code": "UPDATE_RATE",
        "label": "UPDATE RATE"
      },
      {
        "code": "UPDATE_RATE_CHECKER",
        "label": "UPDATE RATE CHECKER"
      },
      {
        "code": "UPDATE_SAVINGSPRODUCT",
        "label": "UPDATE SAVINGSPRODUCT"
      },
      {
        "code": "UPDATE_SAVINGSPRODUCT_CHECKER",
        "label": "UPDATE SAVINGSPRODUCT CHECKER"
      },
      {
        "code": "UPDATE_SMS",
        "label": "UPDATE SMS"
      },
      {
        "code": "UPDATE_SMS_CHECKER",
        "label": "UPDATE SMS CHECKER"
      },
      {
        "code": "UPDATE_SMSCAMPAIGN",
        "label": "UPDATE SMSCAMPAIGN"
      },
      {
        "code": "UPDATE_SMSCAMPAIGN_CHECKER",
        "label": "UPDATE SMSCAMPAIGN CHECKER"
      },
      {
        "code": "UPDATE_STAFF",
        "label": "UPDATE STAFF"
      },
      {
        "code": "UPDATE_STAFF_CHECKER",
        "label": "UPDATE STAFF CHECKER"
      },
      {
        "code": "UPDATE_TAXCOMPONENT",
        "label": "UPDATE TAXCOMPONENT"
      },
      {
        "code": "UPDATE_TAXCOMPONENT_CHECKER",
        "label": "UPDATE TAXCOMPONENT CHECKER"
      },
      {
        "code": "UPDATE_TAXGROUP",
        "label": "UPDATE TAXGROUP"
      },
      {
        "code": "UPDATE_TAXGROUP_CHECKER",
        "label": "UPDATE TAXGROUP CHECKER"
      },
      {
        "code": "UPDATE_TEMPLATE",
        "label": "UPDATE TEMPLATE"
      },
      {
        "code": "UPDATE_WORKINGCAPITALBREACH",
        "label": "UPDATE WORKINGCAPITALBREACH"
      },
      {
        "code": "UPDATE_WORKINGCAPITALLOAN",
        "label": "UPDATE WORKINGCAPITALLOAN"
      },
      {
        "code": "UPDATE_WORKINGCAPITALLOANPRODUCT",
        "label": "UPDATE WORKINGCAPITALLOANPRODUCT"
      },
      {
        "code": "UPDATE_WORKINGCAPITALNEARBREACH",
        "label": "UPDATE WORKINGCAPITALNEARBREACH"
      },
      {
        "code": "UPDATE_WORKINGDAYS",
        "label": "UPDATE WORKINGDAYS"
      },
      {
        "code": "UPDATE_WORKINGDAYS_CHECKER",
        "label": "UPDATE WORKINGDAYS CHECKER"
      },
      {
        "code": "UPDATEDELINQUENCY_LOAN",
        "label": "UPDATEDELINQUENCY LOAN"
      }
    ]
  },
  {
    "id": "portfolio",
    "name": "Portfolio",
    "permissions": [
      {
        "code": "ACCEPTTRANSFER_CLIENT",
        "label": "ACCEPTTRANSFER CLIENT"
      },
      {
        "code": "ACCEPTTRANSFER_CLIENT_CHECKER",
        "label": "ACCEPTTRANSFER CLIENT CHECKER"
      },
      {
        "code": "ACTIVATE_CLIENT",
        "label": "ACTIVATE CLIENT"
      },
      {
        "code": "ACTIVATE_CLIENT_CHECKER",
        "label": "ACTIVATE CLIENT CHECKER"
      },
      {
        "code": "ACTIVATE_GSIMACCOUNT",
        "label": "ACTIVATE GSIMACCOUNT"
      },
      {
        "code": "APPROVALUNDO_GSIMACCOUNT",
        "label": "APPROVALUNDO GSIMACCOUNT"
      },
      {
        "code": "APPROVALUNDO_WORKINGCAPITALLOAN",
        "label": "APPROVALUNDO WORKINGCAPITALLOAN"
      },
      {
        "code": "APPROVE_GLIMLOAN",
        "label": "APPROVE GLIMLOAN"
      },
      {
        "code": "APPROVE_GSIMACCOUNT",
        "label": "APPROVE GSIMACCOUNT"
      },
      {
        "code": "APPROVE_WORKINGCAPITALLOAN",
        "label": "APPROVE WORKINGCAPITALLOAN"
      },
      {
        "code": "ASSIGNSTAFF_CLIENT",
        "label": "ASSIGNSTAFF CLIENT"
      },
      {
        "code": "ATTACH_LOAN_ORIGINATOR",
        "label": "ATTACH LOAN ORIGINATOR"
      },
      {
        "code": "ATTACH_WORKING_CAPITAL_LOAN_ORIGINATOR",
        "label": "ATTACH WORKING CAPITAL LOAN ORIGINATOR"
      },
      {
        "code": "BOUNCE_REPAYMENT_WITH_POSTDATEDCHECKS",
        "label": "BOUNCE REPAYMENT WITH POSTDATEDCHECKS"
      },
      {
        "code": "CLOSE_CENTER",
        "label": "CLOSE CENTER"
      },
      {
        "code": "CLOSE_CENTER_CHECKER",
        "label": "CLOSE CENTER CHECKER"
      },
      {
        "code": "CLOSE_CLIENT",
        "label": "CLOSE CLIENT"
      },
      {
        "code": "CLOSE_CLIENT_CHECKER",
        "label": "CLOSE CLIENT CHECKER"
      },
      {
        "code": "CLOSE_GROUP",
        "label": "CLOSE GROUP"
      },
      {
        "code": "CLOSE_GROUP_CHECKER",
        "label": "CLOSE GROUP CHECKER"
      },
      {
        "code": "CLOSE_GSIMACCOUNT",
        "label": "CLOSE GSIMACCOUNT"
      },
      {
        "code": "CONTRACT_TERMINATION_LOAN",
        "label": "CONTRACT TERMINATION LOAN"
      },
      {
        "code": "CONTRACT_TERMINATION_UNDO_LOAN",
        "label": "CONTRACT TERMINATION UNDO LOAN"
      },
      {
        "code": "CREATE_ADDRESS",
        "label": "CREATE ADDRESS"
      },
      {
        "code": "CREATE_ADDRESS_CHECKER",
        "label": "CREATE ADDRESS CHECKER"
      },
      {
        "code": "CREATE_CHARTSLAB",
        "label": "CREATE CHARTSLAB"
      },
      {
        "code": "CREATE_CHARTSLAB_CHECKER",
        "label": "CREATE CHARTSLAB CHECKER"
      },
      {
        "code": "CREATE_CLIENT",
        "label": "CREATE CLIENT"
      },
      {
        "code": "CREATE_CLIENT_CHECKER",
        "label": "CREATE CLIENT CHECKER"
      },
      {
        "code": "CREATE_CLIENT_COLLATERAL_PRODUCT",
        "label": "CREATE CLIENT COLLATERAL PRODUCT"
      },
      {
        "code": "CREATE_CLIENTCHARGE",
        "label": "CREATE CLIENTCHARGE"
      },
      {
        "code": "CREATE_CLIENTCHARGE_CHECKER",
        "label": "CREATE CLIENTCHARGE CHECKER"
      },
      {
        "code": "CREATE_CLIENTIDENTIFIER",
        "label": "CREATE CLIENTIDENTIFIER"
      },
      {
        "code": "CREATE_CLIENTIDENTIFIER_CHECKER",
        "label": "CREATE CLIENTIDENTIFIER CHECKER"
      },
      {
        "code": "CREATE_CLIENTIMAGE",
        "label": "CREATE CLIENTIMAGE"
      },
      {
        "code": "CREATE_CLIENTIMAGE_CHECKER",
        "label": "CREATE CLIENTIMAGE CHECKER"
      },
      {
        "code": "CREATE_CLIENTNOTE",
        "label": "CREATE CLIENTNOTE"
      },
      {
        "code": "CREATE_CLIENTNOTE_CHECKER",
        "label": "CREATE CLIENTNOTE CHECKER"
      },
      {
        "code": "CREATE_COLLATERAL",
        "label": "CREATE COLLATERAL"
      },
      {
        "code": "CREATE_COLLATERAL_CHECKER",
        "label": "CREATE COLLATERAL CHECKER"
      },
      {
        "code": "CREATE_COLLATERAL_PRODUCT",
        "label": "CREATE COLLATERAL PRODUCT"
      },
      {
        "code": "CREATE_DOCUMENT",
        "label": "CREATE DOCUMENT"
      },
      {
        "code": "CREATE_DOCUMENT_CHECKER",
        "label": "CREATE DOCUMENT CHECKER"
      },
      {
        "code": "CREATE_FAMILYMEMBERS",
        "label": "CREATE FAMILYMEMBERS"
      },
      {
        "code": "CREATE_FIXEDDEPOSITACCOUNT",
        "label": "CREATE FIXEDDEPOSITACCOUNT"
      },
      {
        "code": "CREATE_FIXEDDEPOSITACCOUNT_CHECKER",
        "label": "CREATE FIXEDDEPOSITACCOUNT CHECKER"
      },
      {
        "code": "CREATE_FIXEDDEPOSITPRODUCT",
        "label": "CREATE FIXEDDEPOSITPRODUCT"
      },
      {
        "code": "CREATE_FIXEDDEPOSITPRODUCT_CHECKER",
        "label": "CREATE FIXEDDEPOSITPRODUCT CHECKER"
      },
      {
        "code": "CREATE_FLOATINGRATE",
        "label": "CREATE FLOATINGRATE"
      },
      {
        "code": "CREATE_FLOATINGRATE_CHECKER",
        "label": "CREATE FLOATINGRATE CHECKER"
      },
      {
        "code": "CREATE_GSIMACCOUNT",
        "label": "CREATE GSIMACCOUNT"
      },
      {
        "code": "CREATE_GUARANTOR",
        "label": "CREATE GUARANTOR"
      },
      {
        "code": "CREATE_GUARANTOR_CHECKER",
        "label": "CREATE GUARANTOR CHECKER"
      },
      {
        "code": "CREATE_INTEREST_PAUSE",
        "label": "CREATE INTEREST PAUSE"
      },
      {
        "code": "CREATE_INTERESTRATECHART",
        "label": "CREATE INTERESTRATECHART"
      },
      {
        "code": "CREATE_INTERESTRATECHART_CHECKER",
        "label": "CREATE INTERESTRATECHART CHECKER"
      },
      {
        "code": "CREATE_LOAN",
        "label": "CREATE LOAN"
      },
      {
        "code": "CREATE_LOAN_CHECKER",
        "label": "CREATE LOAN CHECKER"
      },
      {
        "code": "CREATE_LOAN_ORIGINATOR",
        "label": "CREATE LOAN ORIGINATOR"
      },
      {
        "code": "CREATE_LOANCHARGE",
        "label": "CREATE LOANCHARGE"
      },
      {
        "code": "CREATE_LOANCHARGE_CHECKER",
        "label": "CREATE LOANCHARGE CHECKER"
      },
      {
        "code": "CREATE_LOANNOTE",
        "label": "CREATE LOANNOTE"
      },
      {
        "code": "CREATE_LOANNOTE_CHECKER",
        "label": "CREATE LOANNOTE CHECKER"
      },
      {
        "code": "CREATE_LOANTRANSACTIONNOTE",
        "label": "CREATE LOANTRANSACTIONNOTE"
      },
      {
        "code": "CREATE_LOANTRANSACTIONNOTE_CHECKER",
        "label": "CREATE LOANTRANSACTIONNOTE CHECKER"
      },
      {
        "code": "CREATE_MEETING",
        "label": "CREATE MEETING"
      },
      {
        "code": "CREATE_PAYMENTTYPE",
        "label": "CREATE PAYMENTTYPE"
      },
      {
        "code": "CREATE_PRODUCTMIX",
        "label": "CREATE PRODUCTMIX"
      },
      {
        "code": "CREATE_RECURRINGDEPOSITACCOUNT",
        "label": "CREATE RECURRINGDEPOSITACCOUNT"
      },
      {
        "code": "CREATE_RECURRINGDEPOSITACCOUNT_CHECKER",
        "label": "CREATE RECURRINGDEPOSITACCOUNT CHECKER"
      },
      {
        "code": "CREATE_RECURRINGDEPOSITPRODUCT",
        "label": "CREATE RECURRINGDEPOSITPRODUCT"
      },
      {
        "code": "CREATE_RECURRINGDEPOSITPRODUCT_CHECKER",
        "label": "CREATE RECURRINGDEPOSITPRODUCT CHECKER"
      },
      {
        "code": "CREATE_SAVINGNOTE",
        "label": "CREATE SAVINGNOTE"
      },
      {
        "code": "CREATE_SAVINGNOTE_CHECKER",
        "label": "CREATE SAVINGNOTE CHECKER"
      },
      {
        "code": "CREATE_SAVINGSACCOUNT",
        "label": "CREATE SAVINGSACCOUNT"
      },
      {
        "code": "CREATE_SAVINGSACCOUNT_CHECKER",
        "label": "CREATE SAVINGSACCOUNT CHECKER"
      },
      {
        "code": "CREATE_SAVINGSACCOUNTCHARGE",
        "label": "CREATE SAVINGSACCOUNTCHARGE"
      },
      {
        "code": "CREATE_SAVINGSACCOUNTCHARGE_CHECKER",
        "label": "CREATE SAVINGSACCOUNTCHARGE CHECKER"
      },
      {
        "code": "CREATE_STAFFIMAGE",
        "label": "CREATE STAFFIMAGE"
      },
      {
        "code": "CREATE_STAFFIMAGE_CHECKER",
        "label": "CREATE STAFFIMAGE CHECKER"
      },
      {
        "code": "CREATE_WC_BREACH_ACTION",
        "label": "CREATE WC BREACH ACTION"
      },
      {
        "code": "CREATE_WC_BREACH_DISABLE",
        "label": "CREATE WC BREACH DISABLE"
      },
      {
        "code": "CREATE_WC_BREACH_RESET",
        "label": "CREATE WC BREACH RESET"
      },
      {
        "code": "CREATE_WC_DELINQUENCY_ACTION",
        "label": "CREATE WC DELINQUENCY ACTION"
      },
      {
        "code": "CREATE_WC_DELINQUENCY_DISABLE",
        "label": "CREATE WC DELINQUENCY DISABLE"
      },
      {
        "code": "CREATE_WC_DELINQUENCY_RESET",
        "label": "CREATE WC DELINQUENCY RESET"
      },
      {
        "code": "CREATE_WC_NEAR_BREACH_ACTION",
        "label": "CREATE WC NEAR BREACH ACTION"
      },
      {
        "code": "CREATESCHEDULEEXCEPTIONS_LOAN",
        "label": "CREATESCHEDULEEXCEPTIONS LOAN"
      },
      {
        "code": "CREATESCHEDULEEXCEPTIONS_LOAN_CHECKER",
        "label": "CREATESCHEDULEEXCEPTIONS LOAN CHECKER"
      },
      {
        "code": "DEACTIVATEOVERDUE_LOANCHARGE",
        "label": "DEACTIVATEOVERDUE LOANCHARGE"
      },
      {
        "code": "DELETE_ADDRESS",
        "label": "DELETE ADDRESS"
      },
      {
        "code": "DELETE_ADDRESS_CHECKER",
        "label": "DELETE ADDRESS CHECKER"
      },
      {
        "code": "DELETE_CHARTSLAB",
        "label": "DELETE CHARTSLAB"
      },
      {
        "code": "DELETE_CHARTSLAB_CHECKER",
        "label": "DELETE CHARTSLAB CHECKER"
      },
      {
        "code": "DELETE_CLIENT",
        "label": "DELETE CLIENT"
      },
      {
        "code": "DELETE_CLIENT_CHECKER",
        "label": "DELETE CLIENT CHECKER"
      },
      {
        "code": "DELETE_CLIENT_COLLATERAL_PRODUCT",
        "label": "DELETE CLIENT COLLATERAL PRODUCT"
      },
      {
        "code": "DELETE_CLIENTCHARGE",
        "label": "DELETE CLIENTCHARGE"
      },
      {
        "code": "DELETE_CLIENTCHARGE_CHECKER",
        "label": "DELETE CLIENTCHARGE CHECKER"
      },
      {
        "code": "DELETE_CLIENTIDENTIFIER",
        "label": "DELETE CLIENTIDENTIFIER"
      },
      {
        "code": "DELETE_CLIENTIDENTIFIER_CHECKER",
        "label": "DELETE CLIENTIDENTIFIER CHECKER"
      },
      {
        "code": "DELETE_CLIENTIMAGE",
        "label": "DELETE CLIENTIMAGE"
      },
      {
        "code": "DELETE_CLIENTIMAGE_CHECKER",
        "label": "DELETE CLIENTIMAGE CHECKER"
      },
      {
        "code": "DELETE_CLIENTNOTE",
        "label": "DELETE CLIENTNOTE"
      },
      {
        "code": "DELETE_CLIENTNOTE_CHECKER",
        "label": "DELETE CLIENTNOTE CHECKER"
      },
      {
        "code": "DELETE_COLLATERAL",
        "label": "DELETE COLLATERAL"
      },
      {
        "code": "DELETE_COLLATERAL_CHECKER",
        "label": "DELETE COLLATERAL CHECKER"
      },
      {
        "code": "DELETE_COLLATERAL_PRODUCT",
        "label": "DELETE COLLATERAL PRODUCT"
      },
      {
        "code": "DELETE_DOCUMENT",
        "label": "DELETE DOCUMENT"
      },
      {
        "code": "DELETE_DOCUMENT_CHECKER",
        "label": "DELETE DOCUMENT CHECKER"
      },
      {
        "code": "DELETE_FAMILYMEMBERS",
        "label": "DELETE FAMILYMEMBERS"
      },
      {
        "code": "DELETE_FIXEDDEPOSITACCOUNT",
        "label": "DELETE FIXEDDEPOSITACCOUNT"
      },
      {
        "code": "DELETE_FIXEDDEPOSITACCOUNT_CHECKER",
        "label": "DELETE FIXEDDEPOSITACCOUNT CHECKER"
      },
      {
        "code": "DELETE_FIXEDDEPOSITPRODUCT",
        "label": "DELETE FIXEDDEPOSITPRODUCT"
      },
      {
        "code": "DELETE_FIXEDDEPOSITPRODUCT_CHECKER",
        "label": "DELETE FIXEDDEPOSITPRODUCT CHECKER"
      },
      {
        "code": "DELETE_GUARANTOR",
        "label": "DELETE GUARANTOR"
      },
      {
        "code": "DELETE_GUARANTOR_CHECKER",
        "label": "DELETE GUARANTOR CHECKER"
      },
      {
        "code": "DELETE_INTEREST_PAUSE",
        "label": "DELETE INTEREST PAUSE"
      },
      {
        "code": "DELETE_INTERESTRATECHART",
        "label": "DELETE INTERESTRATECHART"
      },
      {
        "code": "DELETE_INTERESTRATECHART_CHECKER",
        "label": "DELETE INTERESTRATECHART CHECKER"
      },
      {
        "code": "DELETE_LOAN",
        "label": "DELETE LOAN"
      },
      {
        "code": "DELETE_LOAN_CHECKER",
        "label": "DELETE LOAN CHECKER"
      },
      {
        "code": "DELETE_LOAN_COLLATERAL_PRODUCT",
        "label": "DELETE LOAN COLLATERAL PRODUCT"
      },
      {
        "code": "DELETE_LOAN_ORIGINATOR",
        "label": "DELETE LOAN ORIGINATOR"
      },
      {
        "code": "DELETE_LOANCHARGE",
        "label": "DELETE LOANCHARGE"
      },
      {
        "code": "DELETE_LOANCHARGE_CHECKER",
        "label": "DELETE LOANCHARGE CHECKER"
      },
      {
        "code": "DELETE_LOANNOTE",
        "label": "DELETE LOANNOTE"
      },
      {
        "code": "DELETE_LOANNOTE_CHECKER",
        "label": "DELETE LOANNOTE CHECKER"
      },
      {
        "code": "DELETE_LOANTRANSACTIONNOTE",
        "label": "DELETE LOANTRANSACTIONNOTE"
      },
      {
        "code": "DELETE_LOANTRANSACTIONNOTE_CHECKER",
        "label": "DELETE LOANTRANSACTIONNOTE CHECKER"
      },
      {
        "code": "DELETE_MEETING",
        "label": "DELETE MEETING"
      },
      {
        "code": "DELETE_PAYMENTTYPE",
        "label": "DELETE PAYMENTTYPE"
      },
      {
        "code": "DELETE_PRODUCTMIX",
        "label": "DELETE PRODUCTMIX"
      },
      {
        "code": "DELETE_RECURRINGDEPOSITACCOUNT",
        "label": "DELETE RECURRINGDEPOSITACCOUNT"
      },
      {
        "code": "DELETE_RECURRINGDEPOSITACCOUNT_CHECKER",
        "label": "DELETE RECURRINGDEPOSITACCOUNT CHECKER"
      },
      {
        "code": "DELETE_RECURRINGDEPOSITPRODUCT",
        "label": "DELETE RECURRINGDEPOSITPRODUCT"
      },
      {
        "code": "DELETE_RECURRINGDEPOSITPRODUCT_CHECKER",
        "label": "DELETE RECURRINGDEPOSITPRODUCT CHECKER"
      },
      {
        "code": "DELETE_REPAYMENT_WITH_POSTDATEDCHECKS",
        "label": "DELETE REPAYMENT WITH POSTDATEDCHECKS"
      },
      {
        "code": "DELETE_SAVINGNOTE",
        "label": "DELETE SAVINGNOTE"
      },
      {
        "code": "DELETE_SAVINGNOTE_CHECKER",
        "label": "DELETE SAVINGNOTE CHECKER"
      },
      {
        "code": "DELETE_SAVINGSACCOUNT",
        "label": "DELETE SAVINGSACCOUNT"
      },
      {
        "code": "DELETE_SAVINGSACCOUNT_CHECKER",
        "label": "DELETE SAVINGSACCOUNT CHECKER"
      },
      {
        "code": "DELETE_SAVINGSACCOUNTCHARGE",
        "label": "DELETE SAVINGSACCOUNTCHARGE"
      },
      {
        "code": "DELETE_SAVINGSACCOUNTCHARGE_CHECKER",
        "label": "DELETE SAVINGSACCOUNTCHARGE CHECKER"
      },
      {
        "code": "DELETE_STAFFIMAGE",
        "label": "DELETE STAFFIMAGE"
      },
      {
        "code": "DELETE_STAFFIMAGE_CHECKER",
        "label": "DELETE STAFFIMAGE CHECKER"
      },
      {
        "code": "DELETESCHEDULEEXCEPTIONS_LOAN",
        "label": "DELETESCHEDULEEXCEPTIONS LOAN"
      },
      {
        "code": "DELETESCHEDULEEXCEPTIONS_LOAN_CHECKER",
        "label": "DELETESCHEDULEEXCEPTIONS LOAN CHECKER"
      },
      {
        "code": "DELINK_ACCOUNT_FROM_POCKET",
        "label": "DELINK ACCOUNT FROM POCKET"
      },
      {
        "code": "DEPOSIT_GSIMACCOUNT",
        "label": "DEPOSIT GSIMACCOUNT"
      },
      {
        "code": "DETACH_LOAN_ORIGINATOR",
        "label": "DETACH LOAN ORIGINATOR"
      },
      {
        "code": "DETACH_WORKING_CAPITAL_LOAN_ORIGINATOR",
        "label": "DETACH WORKING CAPITAL LOAN ORIGINATOR"
      },
      {
        "code": "DISBURSALUNDO_WORKINGCAPITALLOAN",
        "label": "DISBURSALUNDO WORKINGCAPITALLOAN"
      },
      {
        "code": "DISBURSE_GLIMLOAN",
        "label": "DISBURSE GLIMLOAN"
      },
      {
        "code": "DISBURSE_WORKINGCAPITALLOAN",
        "label": "DISBURSE WORKINGCAPITALLOAN"
      },
      {
        "code": "FORCE_WITHDRAWAL_SAVINGSACCOUNT",
        "label": "FORCE WITHDRAWAL SAVINGSACCOUNT"
      },
      {
        "code": "FORCE_WITHDRAWAL_SAVINGSACCOUNT_CHECKER",
        "label": "FORCE WITHDRAWAL SAVINGSACCOUNT CHECKER"
      },
      {
        "code": "FORECLOSURE_LOAN",
        "label": "FORECLOSURE LOAN"
      },
      {
        "code": "FORECLOSURE_LOAN_CHECKER",
        "label": "FORECLOSURE LOAN CHECKER"
      },
      {
        "code": "INACTIVATE_SAVINGSACCOUNTCHARGE",
        "label": "INACTIVATE SAVINGSACCOUNTCHARGE"
      },
      {
        "code": "INACTIVATE_SAVINGSACCOUNTCHARGE_CHECKER",
        "label": "INACTIVATE SAVINGSACCOUNTCHARGE CHECKER"
      },
      {
        "code": "LINK_ACCOUNT_TO_POCKET",
        "label": "LINK ACCOUNT TO POCKET"
      },
      {
        "code": "PAY_CLIENTCHARGE",
        "label": "PAY CLIENTCHARGE"
      },
      {
        "code": "PAY_CLIENTCHARGE_CHECKER",
        "label": "PAY CLIENTCHARGE CHECKER"
      },
      {
        "code": "PAY_SAVINGSACCOUNTCHARGE",
        "label": "PAY SAVINGSACCOUNTCHARGE"
      },
      {
        "code": "PAY_SAVINGSACCOUNTCHARGE_CHECKER",
        "label": "PAY SAVINGSACCOUNTCHARGE CHECKER"
      },
      {
        "code": "PROPOSEANDACCEPTTRANSFER_CLIENT",
        "label": "PROPOSEANDACCEPTTRANSFER CLIENT"
      },
      {
        "code": "PROPOSEANDACCEPTTRANSFER_CLIENT_CHECKER",
        "label": "PROPOSEANDACCEPTTRANSFER CLIENT CHECKER"
      },
      {
        "code": "PROPOSETRANSFER_CLIENT",
        "label": "PROPOSETRANSFER CLIENT"
      },
      {
        "code": "PROPOSETRANSFER_CLIENT_CHECKER",
        "label": "PROPOSETRANSFER CLIENT CHECKER"
      },
      {
        "code": "REACTIVATE_CLIENT",
        "label": "REACTIVATE CLIENT"
      },
      {
        "code": "REACTIVATE_CLIENT_CHECKER",
        "label": "REACTIVATE CLIENT CHECKER"
      },
      {
        "code": "READ_ADDRESS",
        "label": "READ ADDRESS"
      },
      {
        "code": "READ_CLIENT",
        "label": "READ CLIENT"
      },
      {
        "code": "READ_CLIENTCHARGE",
        "label": "READ CLIENTCHARGE"
      },
      {
        "code": "READ_CLIENTIDENTIFIER",
        "label": "READ CLIENTIDENTIFIER"
      },
      {
        "code": "READ_CLIENTIMAGE",
        "label": "READ CLIENTIMAGE"
      },
      {
        "code": "READ_CLIENTNOTE",
        "label": "READ CLIENTNOTE"
      },
      {
        "code": "READ_COLLATERAL",
        "label": "READ COLLATERAL"
      },
      {
        "code": "READ_DOCUMENT",
        "label": "READ DOCUMENT"
      },
      {
        "code": "READ_FAMILYMEMBERS",
        "label": "READ FAMILYMEMBERS"
      },
      {
        "code": "READ_FIXEDDEPOSITACCOUNT",
        "label": "READ FIXEDDEPOSITACCOUNT"
      },
      {
        "code": "READ_FLOATINGRATE",
        "label": "READ FLOATINGRATE"
      },
      {
        "code": "READ_GUARANTOR",
        "label": "READ GUARANTOR"
      },
      {
        "code": "READ_LOAN",
        "label": "READ LOAN"
      },
      {
        "code": "READ_LOAN_ORIGINATOR",
        "label": "READ LOAN ORIGINATOR"
      },
      {
        "code": "READ_LOANNOTE",
        "label": "READ LOANNOTE"
      },
      {
        "code": "READ_LOANTRANSACTIONNOTE",
        "label": "READ LOANTRANSACTIONNOTE"
      },
      {
        "code": "READ_MEETING",
        "label": "READ MEETING"
      },
      {
        "code": "READ_PAYMENTTYPE",
        "label": "READ PAYMENTTYPE"
      },
      {
        "code": "READ_PRODUCTMIX",
        "label": "READ PRODUCTMIX"
      },
      {
        "code": "READ_RECURRINGDEPOSITACCOUNT",
        "label": "READ RECURRINGDEPOSITACCOUNT"
      },
      {
        "code": "READ_SAVINGNOTE",
        "label": "READ SAVINGNOTE"
      },
      {
        "code": "READ_SAVINGSACCOUNT",
        "label": "READ SAVINGSACCOUNT"
      },
      {
        "code": "READ_SAVINGSACCOUNTCHARGE",
        "label": "READ SAVINGSACCOUNTCHARGE"
      },
      {
        "code": "READ_STAFFIMAGE",
        "label": "READ STAFFIMAGE"
      },
      {
        "code": "READ_WC_BREACH_ACTION",
        "label": "READ WC BREACH ACTION"
      },
      {
        "code": "READ_WC_DELINQUENCY_ACTION",
        "label": "READ WC DELINQUENCY ACTION"
      },
      {
        "code": "READ_WC_NEAR_BREACH_ACTION",
        "label": "READ WC NEAR BREACH ACTION"
      },
      {
        "code": "REAGE_LOAN",
        "label": "REAGE LOAN"
      },
      {
        "code": "REAMORTIZE_LOAN",
        "label": "REAMORTIZE LOAN"
      },
      {
        "code": "RECOVERGUARANTEES_LOAN",
        "label": "RECOVERGUARANTEES LOAN"
      },
      {
        "code": "RECOVERGUARANTEES_LOAN_CHECKER",
        "label": "RECOVERGUARANTEES LOAN CHECKER"
      },
      {
        "code": "REJECT_CLIENT",
        "label": "REJECT CLIENT"
      },
      {
        "code": "REJECT_CLIENT_CHECKER",
        "label": "REJECT CLIENT CHECKER"
      },
      {
        "code": "REJECT_GLIMLOAN",
        "label": "REJECT GLIMLOAN"
      },
      {
        "code": "REJECT_GSIMACCOUNT",
        "label": "REJECT GSIMACCOUNT"
      },
      {
        "code": "REJECT_WORKINGCAPITALLOAN",
        "label": "REJECT WORKINGCAPITALLOAN"
      },
      {
        "code": "REJECTTRANSFER_CLIENT",
        "label": "REJECTTRANSFER CLIENT"
      },
      {
        "code": "REJECTTRANSFER_CLIENT_CHECKER",
        "label": "REJECTTRANSFER CLIENT CHECKER"
      },
      {
        "code": "REMOVESAVINGSOFFICER_SAVINGSACCOUNT",
        "label": "REMOVESAVINGSOFFICER SAVINGSACCOUNT"
      },
      {
        "code": "REMOVESAVINGSOFFICER_SAVINGSACCOUNT_CHECKER",
        "label": "REMOVESAVINGSOFFICER SAVINGSACCOUNT CHECKER"
      },
      {
        "code": "REPAYMENT_GLIMLOAN",
        "label": "REPAYMENT GLIMLOAN"
      },
      {
        "code": "SAVEORUPDATEATTENDANCE_MEETING",
        "label": "SAVEORUPDATEATTENDANCE MEETING"
      },
      {
        "code": "SETFRAUD_LOAN",
        "label": "SETFRAUD LOAN"
      },
      {
        "code": "SETFRAUD_WORKINGCAPITALLOAN",
        "label": "SETFRAUD WORKINGCAPITALLOAN"
      },
      {
        "code": "UNASSIGNSTAFF_CLIENT",
        "label": "UNASSIGNSTAFF CLIENT"
      },
      {
        "code": "UNDO_REAGE_LOAN",
        "label": "UNDO REAGE LOAN"
      },
      {
        "code": "UNDO_REAMORTIZE_LOAN",
        "label": "UNDO REAMORTIZE LOAN"
      },
      {
        "code": "UNDOAPPROVAL_GLIMLOAN",
        "label": "UNDOAPPROVAL GLIMLOAN"
      },
      {
        "code": "UNDODISBURSAL_GLIMLOAN",
        "label": "UNDODISBURSAL GLIMLOAN"
      },
      {
        "code": "UNDOREJECT_CLIENT",
        "label": "UNDOREJECT CLIENT"
      },
      {
        "code": "UNDOREJECT_CLIENT_CHECKER",
        "label": "UNDOREJECT CLIENT CHECKER"
      },
      {
        "code": "UNDOWITHDRAWAL_CLIENT",
        "label": "UNDOWITHDRAWAL CLIENT"
      },
      {
        "code": "UNDOWITHDRAWAL_CLIENT_CHECKER",
        "label": "UNDOWITHDRAWAL CLIENT CHECKER"
      },
      {
        "code": "UPDATE_ADDRESS",
        "label": "UPDATE ADDRESS"
      },
      {
        "code": "UPDATE_ADDRESS_CHECKER",
        "label": "UPDATE ADDRESS CHECKER"
      },
      {
        "code": "UPDATE_CHARTSLAB",
        "label": "UPDATE CHARTSLAB"
      },
      {
        "code": "UPDATE_CHARTSLAB_CHECKER",
        "label": "UPDATE CHARTSLAB CHECKER"
      },
      {
        "code": "UPDATE_CLIENT",
        "label": "UPDATE CLIENT"
      },
      {
        "code": "UPDATE_CLIENT_CHECKER",
        "label": "UPDATE CLIENT CHECKER"
      },
      {
        "code": "UPDATE_CLIENT_COLLATERAL_PRODUCT",
        "label": "UPDATE CLIENT COLLATERAL PRODUCT"
      },
      {
        "code": "UPDATE_CLIENTCHARGE",
        "label": "UPDATE CLIENTCHARGE"
      },
      {
        "code": "UPDATE_CLIENTCHARGE_CHECKER",
        "label": "UPDATE CLIENTCHARGE CHECKER"
      },
      {
        "code": "UPDATE_CLIENTIDENTIFIER",
        "label": "UPDATE CLIENTIDENTIFIER"
      },
      {
        "code": "UPDATE_CLIENTIDENTIFIER_CHECKER",
        "label": "UPDATE CLIENTIDENTIFIER CHECKER"
      },
      {
        "code": "UPDATE_CLIENTNOTE",
        "label": "UPDATE CLIENTNOTE"
      },
      {
        "code": "UPDATE_CLIENTNOTE_CHECKER",
        "label": "UPDATE CLIENTNOTE CHECKER"
      },
      {
        "code": "UPDATE_COLLATERAL",
        "label": "UPDATE COLLATERAL"
      },
      {
        "code": "UPDATE_COLLATERAL_CHECKER",
        "label": "UPDATE COLLATERAL CHECKER"
      },
      {
        "code": "UPDATE_COLLATERAL_PRODUCT",
        "label": "UPDATE COLLATERAL PRODUCT"
      },
      {
        "code": "UPDATE_DISBURSEMENTDETAIL",
        "label": "UPDATE DISBURSEMENTDETAIL"
      },
      {
        "code": "UPDATE_DOCUMENT",
        "label": "UPDATE DOCUMENT"
      },
      {
        "code": "UPDATE_DOCUMENT_CHECKER",
        "label": "UPDATE DOCUMENT CHECKER"
      },
      {
        "code": "UPDATE_FAMILYMEMBERS",
        "label": "UPDATE FAMILYMEMBERS"
      },
      {
        "code": "UPDATE_FIXEDDEPOSITACCOUNT",
        "label": "UPDATE FIXEDDEPOSITACCOUNT"
      },
      {
        "code": "UPDATE_FIXEDDEPOSITACCOUNT_CHECKER",
        "label": "UPDATE FIXEDDEPOSITACCOUNT CHECKER"
      },
      {
        "code": "UPDATE_FIXEDDEPOSITPRODUCT",
        "label": "UPDATE FIXEDDEPOSITPRODUCT"
      },
      {
        "code": "UPDATE_FIXEDDEPOSITPRODUCT_CHECKER",
        "label": "UPDATE FIXEDDEPOSITPRODUCT CHECKER"
      },
      {
        "code": "UPDATE_FLOATINGRATE",
        "label": "UPDATE FLOATINGRATE"
      },
      {
        "code": "UPDATE_FLOATINGRATE_CHECKER",
        "label": "UPDATE FLOATINGRATE CHECKER"
      },
      {
        "code": "UPDATE_GSIMACCOUNT",
        "label": "UPDATE GSIMACCOUNT"
      },
      {
        "code": "UPDATE_GUARANTOR",
        "label": "UPDATE GUARANTOR"
      },
      {
        "code": "UPDATE_GUARANTOR_CHECKER",
        "label": "UPDATE GUARANTOR CHECKER"
      },
      {
        "code": "UPDATE_INTEREST_PAUSE",
        "label": "UPDATE INTEREST PAUSE"
      },
      {
        "code": "UPDATE_INTERESTRATECHART",
        "label": "UPDATE INTERESTRATECHART"
      },
      {
        "code": "UPDATE_INTERESTRATECHART_CHECKER",
        "label": "UPDATE INTERESTRATECHART CHECKER"
      },
      {
        "code": "UPDATE_LOAN",
        "label": "UPDATE LOAN"
      },
      {
        "code": "UPDATE_LOAN_CHECKER",
        "label": "UPDATE LOAN CHECKER"
      },
      {
        "code": "UPDATE_LOAN_ORIGINATOR",
        "label": "UPDATE LOAN ORIGINATOR"
      },
      {
        "code": "UPDATE_LOANCHARGE",
        "label": "UPDATE LOANCHARGE"
      },
      {
        "code": "UPDATE_LOANCHARGE_CHECKER",
        "label": "UPDATE LOANCHARGE CHECKER"
      },
      {
        "code": "UPDATE_LOANNOTE",
        "label": "UPDATE LOANNOTE"
      },
      {
        "code": "UPDATE_LOANNOTE_CHECKER",
        "label": "UPDATE LOANNOTE CHECKER"
      },
      {
        "code": "UPDATE_LOANTRANSACTIONNOTE",
        "label": "UPDATE LOANTRANSACTIONNOTE"
      },
      {
        "code": "UPDATE_LOANTRANSACTIONNOTE_CHECKER",
        "label": "UPDATE LOANTRANSACTIONNOTE CHECKER"
      },
      {
        "code": "UPDATE_MEETING",
        "label": "UPDATE MEETING"
      },
      {
        "code": "UPDATE_PAYMENTTYPE",
        "label": "UPDATE PAYMENTTYPE"
      },
      {
        "code": "UPDATE_PRODUCTMIX",
        "label": "UPDATE PRODUCTMIX"
      },
      {
        "code": "UPDATE_RECURRINGDEPOSITACCOUNT",
        "label": "UPDATE RECURRINGDEPOSITACCOUNT"
      },
      {
        "code": "UPDATE_RECURRINGDEPOSITACCOUNT_CHECKER",
        "label": "UPDATE RECURRINGDEPOSITACCOUNT CHECKER"
      },
      {
        "code": "UPDATE_RECURRINGDEPOSITPRODUCT",
        "label": "UPDATE RECURRINGDEPOSITPRODUCT"
      },
      {
        "code": "UPDATE_RECURRINGDEPOSITPRODUCT_CHECKER",
        "label": "UPDATE RECURRINGDEPOSITPRODUCT CHECKER"
      },
      {
        "code": "UPDATE_REPAYMENT_WITH_POSTDATEDCHECKS",
        "label": "UPDATE REPAYMENT WITH POSTDATEDCHECKS"
      },
      {
        "code": "UPDATE_SAVINGNOTE",
        "label": "UPDATE SAVINGNOTE"
      },
      {
        "code": "UPDATE_SAVINGNOTE_CHECKER",
        "label": "UPDATE SAVINGNOTE CHECKER"
      },
      {
        "code": "UPDATE_SAVINGSACCOUNT",
        "label": "UPDATE SAVINGSACCOUNT"
      },
      {
        "code": "UPDATE_SAVINGSACCOUNT_CHECKER",
        "label": "UPDATE SAVINGSACCOUNT CHECKER"
      },
      {
        "code": "UPDATE_SAVINGSACCOUNTCHARGE",
        "label": "UPDATE SAVINGSACCOUNTCHARGE"
      },
      {
        "code": "UPDATE_SAVINGSACCOUNTCHARGE_CHECKER",
        "label": "UPDATE SAVINGSACCOUNTCHARGE CHECKER"
      },
      {
        "code": "UPDATEDISCOUNT_WORKINGCAPITALLOAN",
        "label": "UPDATEDISCOUNT WORKINGCAPITALLOAN"
      },
      {
        "code": "UPDATERATE_WORKINGCAPITALLOAN",
        "label": "UPDATERATE WORKINGCAPITALLOAN"
      },
      {
        "code": "UPDATESAVINGSACCOUNT_CLIENT",
        "label": "UPDATESAVINGSACCOUNT CLIENT"
      },
      {
        "code": "UPDATESAVINGSOFFICER_SAVINGSACCOUNT",
        "label": "UPDATESAVINGSOFFICER SAVINGSACCOUNT"
      },
      {
        "code": "UPDATESAVINGSOFFICER_SAVINGSACCOUNT_CHECKER",
        "label": "UPDATESAVINGSOFFICER SAVINGSACCOUNT CHECKER"
      },
      {
        "code": "UPDATEWITHHOLDTAX_SAVINGSACCOUNT",
        "label": "UPDATEWITHHOLDTAX SAVINGSACCOUNT"
      },
      {
        "code": "UPDATEWITHHOLDTAX_SAVINGSACCOUNT_CHECKER",
        "label": "UPDATEWITHHOLDTAX SAVINGSACCOUNT CHECKER"
      },
      {
        "code": "WAIVE_CLIENTCHARGE",
        "label": "WAIVE CLIENTCHARGE"
      },
      {
        "code": "WAIVE_CLIENTCHARGE_CHECKER",
        "label": "WAIVE CLIENTCHARGE CHECKER"
      },
      {
        "code": "WAIVE_LOANCHARGE",
        "label": "WAIVE LOANCHARGE"
      },
      {
        "code": "WAIVE_LOANCHARGE_CHECKER",
        "label": "WAIVE LOANCHARGE CHECKER"
      },
      {
        "code": "WAIVE_SAVINGSACCOUNTCHARGE",
        "label": "WAIVE SAVINGSACCOUNTCHARGE"
      },
      {
        "code": "WAIVE_SAVINGSACCOUNTCHARGE_CHECKER",
        "label": "WAIVE SAVINGSACCOUNTCHARGE CHECKER"
      },
      {
        "code": "WITHDRAW_CLIENT",
        "label": "WITHDRAW CLIENT"
      },
      {
        "code": "WITHDRAW_CLIENT_CHECKER",
        "label": "WITHDRAW CLIENT CHECKER"
      },
      {
        "code": "WITHDRAWTRANSFER_CLIENT",
        "label": "WITHDRAWTRANSFER CLIENT"
      },
      {
        "code": "WITHDRAWTRANSFER_CLIENT_CHECKER",
        "label": "WITHDRAWTRANSFER CLIENT CHECKER"
      }
    ]
  },
  {
    "id": "portfolio_center",
    "name": "Center",
    "permissions": [
      {
        "code": "ACTIVATE_CENTER",
        "label": "ACTIVATE CENTER"
      },
      {
        "code": "ACTIVATE_CENTER_CHECKER",
        "label": "ACTIVATE CENTER CHECKER"
      },
      {
        "code": "ASSOCIATEGROUPS_CENTER",
        "label": "ASSOCIATEGROUPS CENTER"
      },
      {
        "code": "ASSOCIATEGROUPS_CENTER_CHECKER",
        "label": "ASSOCIATEGROUPS CENTER CHECKER"
      },
      {
        "code": "CREATE_CENTER",
        "label": "CREATE CENTER"
      },
      {
        "code": "CREATE_CENTER_CHECKER",
        "label": "CREATE CENTER CHECKER"
      },
      {
        "code": "DELETE_CENTER",
        "label": "DELETE CENTER"
      },
      {
        "code": "DELETE_CENTER_CHECKER",
        "label": "DELETE CENTER CHECKER"
      },
      {
        "code": "DISASSOCIATEGROUPS_CENTER",
        "label": "DISASSOCIATEGROUPS CENTER"
      },
      {
        "code": "DISASSOCIATEGROUPS_CENTER_CHECKER",
        "label": "DISASSOCIATEGROUPS CENTER CHECKER"
      },
      {
        "code": "READ_CENTER",
        "label": "READ CENTER"
      },
      {
        "code": "SAVECOLLECTIONSHEET_CENTER",
        "label": "SAVECOLLECTIONSHEET CENTER"
      },
      {
        "code": "UPDATE_CENTER",
        "label": "UPDATE CENTER"
      },
      {
        "code": "UPDATE_CENTER_CHECKER",
        "label": "UPDATE CENTER CHECKER"
      }
    ]
  },
  {
    "id": "portfolio_group",
    "name": "Group",
    "permissions": [
      {
        "code": "ACTIVATE_GROUP",
        "label": "ACTIVATE GROUP"
      },
      {
        "code": "ACTIVATE_GROUP_CHECKER",
        "label": "ACTIVATE GROUP CHECKER"
      },
      {
        "code": "ASSIGNROLE_GROUP",
        "label": "ASSIGNROLE GROUP"
      },
      {
        "code": "ASSIGNSTAFF_GROUP",
        "label": "ASSIGNSTAFF GROUP"
      },
      {
        "code": "ASSOCIATECLIENTS_GROUP",
        "label": "ASSOCIATECLIENTS GROUP"
      },
      {
        "code": "CREATE_GROUP",
        "label": "CREATE GROUP"
      },
      {
        "code": "CREATE_GROUP_CHECKER",
        "label": "CREATE GROUP CHECKER"
      },
      {
        "code": "CREATE_GROUPNOTE",
        "label": "CREATE GROUPNOTE"
      },
      {
        "code": "CREATE_GROUPNOTE_CHECKER",
        "label": "CREATE GROUPNOTE CHECKER"
      },
      {
        "code": "DELETE_GROUP",
        "label": "DELETE GROUP"
      },
      {
        "code": "DELETE_GROUP_CHECKER",
        "label": "DELETE GROUP CHECKER"
      },
      {
        "code": "DELETE_GROUPNOTE",
        "label": "DELETE GROUPNOTE"
      },
      {
        "code": "DELETE_GROUPNOTE_CHECKER",
        "label": "DELETE GROUPNOTE CHECKER"
      },
      {
        "code": "DISASSOCIATECLIENTS_GROUP",
        "label": "DISASSOCIATECLIENTS GROUP"
      },
      {
        "code": "READ_GROUP",
        "label": "READ GROUP"
      },
      {
        "code": "READ_GROUPNOTE",
        "label": "READ GROUPNOTE"
      },
      {
        "code": "SAVECOLLECTIONSHEET_GROUP",
        "label": "SAVECOLLECTIONSHEET GROUP"
      },
      {
        "code": "TRANSFERCLIENTS_GROUP",
        "label": "TRANSFERCLIENTS GROUP"
      },
      {
        "code": "TRANSFERCLIENTS_GROUP_CHECKER",
        "label": "TRANSFERCLIENTS GROUP CHECKER"
      },
      {
        "code": "UNASSIGNROLE_GROUP",
        "label": "UNASSIGNROLE GROUP"
      },
      {
        "code": "UNASSIGNSTAFF_GROUP",
        "label": "UNASSIGNSTAFF GROUP"
      },
      {
        "code": "UNASSIGNSTAFF_GROUP_CHECKER",
        "label": "UNASSIGNSTAFF GROUP CHECKER"
      },
      {
        "code": "UPDATE_GROUP",
        "label": "UPDATE GROUP"
      },
      {
        "code": "UPDATE_GROUP_CHECKER",
        "label": "UPDATE GROUP CHECKER"
      },
      {
        "code": "UPDATE_GROUPNOTE",
        "label": "UPDATE GROUPNOTE"
      },
      {
        "code": "UPDATE_GROUPNOTE_CHECKER",
        "label": "UPDATE GROUPNOTE CHECKER"
      },
      {
        "code": "UPDATEROLE_GROUP",
        "label": "UPDATEROLE GROUP"
      }
    ]
  },
  {
    "id": "report",
    "name": "Report",
    "permissions": [
      {
        "code": "READ_Active Clients - Email",
        "label": "READ Active Clients - Email"
      },
      {
        "code": "READ_Active Group Leaders - Email",
        "label": "READ Active Group Leaders - Email"
      },
      {
        "code": "READ_Active Loan Clients - Email",
        "label": "READ Active Loan Clients - Email"
      },
      {
        "code": "READ_Active Loan Summary per Branch",
        "label": "READ Active Loan Summary per Branch"
      },
      {
        "code": "READ_Active Loans - Details",
        "label": "READ Active Loans - Details"
      },
      {
        "code": "READ_Active Loans - Summary",
        "label": "READ Active Loans - Summary"
      },
      {
        "code": "READ_Active Loans by Disbursal Period",
        "label": "READ Active Loans by Disbursal Period"
      },
      {
        "code": "READ_Active Loans in last installment",
        "label": "READ Active Loans in last installment"
      },
      {
        "code": "READ_Active Loans in last installment Summary",
        "label": "READ Active Loans in last installment Summary"
      },
      {
        "code": "READ_Active Loans Passed Final Maturity",
        "label": "READ Active Loans Passed Final Maturity"
      },
      {
        "code": "READ_Active Loans Passed Final Maturity Summary",
        "label": "READ Active Loans Passed Final Maturity Summary"
      },
      {
        "code": "READ_Aging Detail",
        "label": "READ Aging Detail"
      },
      {
        "code": "READ_Aging Summary (Arrears in Months)",
        "label": "READ Aging Summary (Arrears in Months)"
      },
      {
        "code": "READ_Aging Summary (Arrears in Weeks)",
        "label": "READ Aging Summary (Arrears in Weeks)"
      },
      {
        "code": "READ_Balance Outstanding",
        "label": "READ Balance Outstanding"
      },
      {
        "code": "READ_Balance Sheet",
        "label": "READ Balance Sheet"
      },
      {
        "code": "READ_Branch Expected Cash Flow",
        "label": "READ Branch Expected Cash Flow"
      },
      {
        "code": "READ_BranchManagerStats",
        "label": "READ BranchManagerStats"
      },
      {
        "code": "READ_ChildrenStaffList",
        "label": "READ ChildrenStaffList"
      },
      {
        "code": "READ_Client Listing",
        "label": "READ Client Listing"
      },
      {
        "code": "READ_Client Loan Account Schedule",
        "label": "READ Client Loan Account Schedule"
      },
      {
        "code": "READ_Client Loans Listing",
        "label": "READ Client Loans Listing"
      },
      {
        "code": "READ_Client Saving Transactions",
        "label": "READ Client Saving Transactions"
      },
      {
        "code": "READ_Client Savings Summary",
        "label": "READ Client Savings Summary"
      },
      {
        "code": "READ_ClientSummary",
        "label": "READ ClientSummary"
      },
      {
        "code": "READ_ClientTrendsByDay",
        "label": "READ ClientTrendsByDay"
      },
      {
        "code": "READ_ClientTrendsByMonth",
        "label": "READ ClientTrendsByMonth"
      },
      {
        "code": "READ_ClientTrendsByWeek",
        "label": "READ ClientTrendsByWeek"
      },
      {
        "code": "READ_Collection Report",
        "label": "READ Collection Report"
      },
      {
        "code": "READ_CoordinatorStats",
        "label": "READ CoordinatorStats"
      },
      {
        "code": "READ_Demand_Vs_Collection",
        "label": "READ Demand Vs Collection"
      },
      {
        "code": "READ_Disbursal Report",
        "label": "READ Disbursal Report"
      },
      {
        "code": "READ_Disbursal_Vs_Awaitingdisbursal",
        "label": "READ Disbursal Vs Awaitingdisbursal"
      },
      {
        "code": "READ_Dormant Prospects - Email",
        "label": "READ Dormant Prospects - Email"
      },
      {
        "code": "READ_Expected Payments By Date - Basic",
        "label": "READ Expected Payments By Date - Basic"
      },
      {
        "code": "READ_Expected Payments By Date - Formatted",
        "label": "READ Expected Payments By Date - Formatted"
      },
      {
        "code": "READ_FieldAgentPrograms",
        "label": "READ FieldAgentPrograms"
      },
      {
        "code": "READ_FieldAgentStats",
        "label": "READ FieldAgentStats"
      },
      {
        "code": "READ_Funds Disbursed Between Dates Summary",
        "label": "READ Funds Disbursed Between Dates Summary"
      },
      {
        "code": "READ_Funds Disbursed Between Dates Summary by Office",
        "label": "READ Funds Disbursed Between Dates Summary by Office"
      },
      {
        "code": "READ_General Ledger Report",
        "label": "READ General Ledger Report"
      },
      {
        "code": "READ_GroupNamesByStaff",
        "label": "READ GroupNamesByStaff"
      },
      {
        "code": "READ_GroupSavingSummary",
        "label": "READ GroupSavingSummary"
      },
      {
        "code": "READ_GroupSummaryAmounts",
        "label": "READ GroupSummaryAmounts"
      },
      {
        "code": "READ_GroupSummaryCounts",
        "label": "READ GroupSummaryCounts"
      },
      {
        "code": "READ_Happy Birthday - Email",
        "label": "READ Happy Birthday - Email"
      },
      {
        "code": "READ_Income Statement",
        "label": "READ Income Statement"
      },
      {
        "code": "READ_Loan Account Schedule",
        "label": "READ Loan Account Schedule"
      },
      {
        "code": "READ_Loan Approved - Email",
        "label": "READ Loan Approved - Email"
      },
      {
        "code": "READ_Loan Fully Repaid - Email",
        "label": "READ Loan Fully Repaid - Email"
      },
      {
        "code": "READ_Loan payments due - Email",
        "label": "READ Loan payments due - Email"
      },
      {
        "code": "READ_Loan Payments Due (Overdue Loans) - Email",
        "label": "READ Loan Payments Due (Overdue Loans) - Email"
      },
      {
        "code": "READ_Loan Payments Received (Active Loans) - Email",
        "label": "READ Loan Payments Received (Active Loans) - Email"
      },
      {
        "code": "READ_Loan Payments Received (Overdue Loans) - Email",
        "label": "READ Loan Payments Received (Overdue Loans) - Email"
      },
      {
        "code": "READ_Loan Rejected - Email",
        "label": "READ Loan Rejected - Email"
      },
      {
        "code": "READ_Loan Repayment - Email",
        "label": "READ Loan Repayment - Email"
      },
      {
        "code": "READ_LoanCyclePerProduct",
        "label": "READ LoanCyclePerProduct"
      },
      {
        "code": "READ_Loans Awaiting Disbursal",
        "label": "READ Loans Awaiting Disbursal"
      },
      {
        "code": "READ_Loans Awaiting Disbursal Summary",
        "label": "READ Loans Awaiting Disbursal Summary"
      },
      {
        "code": "READ_Loans Awaiting Disbursal Summary by Month",
        "label": "READ Loans Awaiting Disbursal Summary by Month"
      },
      {
        "code": "READ_Loans disbursed to clients - Email",
        "label": "READ Loans disbursed to clients - Email"
      },
      {
        "code": "READ_Loans in arrears - Email",
        "label": "READ Loans in arrears - Email"
      },
      {
        "code": "READ_Loans Outstanding after final instalment date - Email",
        "label": "READ Loans Outstanding after final instalment date - Email"
      },
      {
        "code": "READ_Loans Pending Approval",
        "label": "READ Loans Pending Approval"
      },
      {
        "code": "READ_LoanTrendsByDay",
        "label": "READ LoanTrendsByDay"
      },
      {
        "code": "READ_LoanTrendsByMonth",
        "label": "READ LoanTrendsByMonth"
      },
      {
        "code": "READ_LoanTrendsByWeek",
        "label": "READ LoanTrendsByWeek"
      },
      {
        "code": "READ_Obligation Met Loans Details",
        "label": "READ Obligation Met Loans Details"
      },
      {
        "code": "READ_Obligation Met Loans Summary",
        "label": "READ Obligation Met Loans Summary"
      },
      {
        "code": "READ_Portfolio at Risk",
        "label": "READ Portfolio at Risk"
      },
      {
        "code": "READ_Portfolio at Risk by Branch",
        "label": "READ Portfolio at Risk by Branch"
      },
      {
        "code": "READ_ProgramDetails",
        "label": "READ ProgramDetails"
      },
      {
        "code": "READ_ProgramDirectorStats",
        "label": "READ ProgramDirectorStats"
      },
      {
        "code": "READ_ProgramStats",
        "label": "READ ProgramStats"
      },
      {
        "code": "READ_Prospective Clients - Email",
        "label": "READ Prospective Clients - Email"
      },
      {
        "code": "READ_Rescheduled Loans",
        "label": "READ Rescheduled Loans"
      },
      {
        "code": "READ_Savings Transactions",
        "label": "READ Savings Transactions"
      },
      {
        "code": "READ_Trial Balance",
        "label": "READ Trial Balance"
      },
      {
        "code": "READ_TxnRunningBalances",
        "label": "READ TxnRunningBalances"
      },
      {
        "code": "READ_Written-Off Loans",
        "label": "READ Written-Off Loans"
      }
    ]
  },
  {
    "id": "SHAREACCOUNT",
    "name": "SHAREACCOUNT",
    "permissions": [
      {
        "code": "ACTIVATE_SHAREACCOUNT",
        "label": "ACTIVATE SHAREACCOUNT"
      },
      {
        "code": "APPLYADDITIONALSHARES_SHAREACCOUNT",
        "label": "APPLYADDITIONALSHARES SHAREACCOUNT"
      },
      {
        "code": "APPROVE_SHAREACCOUNT",
        "label": "APPROVE SHAREACCOUNT"
      },
      {
        "code": "APPROVEADDITIONALSHARES_SHAREACCOUNT",
        "label": "APPROVEADDITIONALSHARES SHAREACCOUNT"
      },
      {
        "code": "CLOSE_SHAREACCOUNT",
        "label": "CLOSE SHAREACCOUNT"
      },
      {
        "code": "CREATE_SHAREACCOUNT",
        "label": "CREATE SHAREACCOUNT"
      },
      {
        "code": "REDEEMSHARES_SHAREACCOUNT",
        "label": "REDEEMSHARES SHAREACCOUNT"
      },
      {
        "code": "REJECT_SHAREACCOUNT",
        "label": "REJECT SHAREACCOUNT"
      },
      {
        "code": "REJECTADDITIONALSHARES_SHAREACCOUNT",
        "label": "REJECTADDITIONALSHARES SHAREACCOUNT"
      },
      {
        "code": "UNDOAPPROVAL_SHAREACCOUNT",
        "label": "UNDOAPPROVAL SHAREACCOUNT"
      },
      {
        "code": "UPDATE_SHAREACCOUNT",
        "label": "UPDATE SHAREACCOUNT"
      }
    ]
  },
  {
    "id": "SHAREPRODUCT",
    "name": "SHAREPRODUCT",
    "permissions": [
      {
        "code": "APPROVE_DIVIDEND_SHAREPRODUCT",
        "label": "APPROVE DIVIDEND SHAREPRODUCT"
      },
      {
        "code": "APPROVE_DIVIDEND_SHAREPRODUCT_CHECKER",
        "label": "APPROVE DIVIDEND SHAREPRODUCT CHECKER"
      },
      {
        "code": "CREATE_DIVIDEND_SHAREPRODUCT",
        "label": "CREATE DIVIDEND SHAREPRODUCT"
      },
      {
        "code": "CREATE_DIVIDEND_SHAREPRODUCT_CHECKER",
        "label": "CREATE DIVIDEND SHAREPRODUCT CHECKER"
      },
      {
        "code": "CREATE_SHAREPRODUCT",
        "label": "CREATE SHAREPRODUCT"
      },
      {
        "code": "DELETE_DIVIDEND_SHAREPRODUCT",
        "label": "DELETE DIVIDEND SHAREPRODUCT"
      },
      {
        "code": "DELETE_DIVIDEND_SHAREPRODUCT_CHECKER",
        "label": "DELETE DIVIDEND SHAREPRODUCT CHECKER"
      },
      {
        "code": "READ_DIVIDEND_SHAREPRODUCT",
        "label": "READ DIVIDEND SHAREPRODUCT"
      },
      {
        "code": "UPDATE_SHAREPRODUCT",
        "label": "UPDATE SHAREPRODUCT"
      }
    ]
  },
  {
    "id": "special",
    "name": "Special",
    "permissions": [
      {
        "code": "ALL_FUNCTIONS",
        "label": "ALL FUNCTIONS"
      },
      {
        "code": "ALL_FUNCTIONS_READ",
        "label": "ALL FUNCTIONS READ"
      },
      {
        "code": "BYPASS_TWOFACTOR",
        "label": "BYPASS TWOFACTOR"
      },
      {
        "code": "CHECKER_SUPER_USER",
        "label": "CHECKER SUPER USER"
      },
      {
        "code": "REPORTING_SUPER_USER",
        "label": "REPORTING SUPER USER"
      }
    ]
  },
  {
    "id": "SSBENEFICIARYTPT",
    "name": "SSBENEFICIARYTPT",
    "permissions": [
      {
        "code": "CREATE_SSBENEFICIARYTPT",
        "label": "CREATE SSBENEFICIARYTPT"
      },
      {
        "code": "DELETE_SSBENEFICIARYTPT",
        "label": "DELETE SSBENEFICIARYTPT"
      },
      {
        "code": "READ_SSBENEFICIARYTPT",
        "label": "READ SSBENEFICIARYTPT"
      },
      {
        "code": "UPDATE_SSBENEFICIARYTPT",
        "label": "UPDATE SSBENEFICIARYTPT"
      }
    ]
  },
  {
    "id": "survey",
    "name": "Survey",
    "permissions": [
      {
        "code": "REGISTER_SURVEY",
        "label": "REGISTER SURVEY"
      }
    ]
  },
  {
    "id": "transaction_client",
    "name": "Client Transactions",
    "permissions": [
      {
        "code": "READTRANSACTION_CLIENT",
        "label": "READTRANSACTION CLIENT"
      },
      {
        "code": "UNDOTRANSACTION_CLIENT",
        "label": "UNDOTRANSACTION CLIENT"
      },
      {
        "code": "UNDOTRANSACTION_CLIENT_CHECKER",
        "label": "UNDOTRANSACTION CLIENT CHECKER"
      }
    ]
  },
  {
    "id": "transaction_loan",
    "name": "Loan Transactions",
    "permissions": [
      {
        "code": "ADJUST_LOAN",
        "label": "ADJUST LOAN"
      },
      {
        "code": "ADJUST_LOAN_CHECKER",
        "label": "ADJUST LOAN CHECKER"
      },
      {
        "code": "ADJUSTMENT_LOANCHARGE",
        "label": "ADJUSTMENT LOANCHARGE"
      },
      {
        "code": "ADJUSTMENT_WORKINGCAPITALLOANCHARGE",
        "label": "ADJUSTMENT WORKINGCAPITALLOANCHARGE"
      },
      {
        "code": "ADJUSTMENT_WORKINGCAPITALLOANCHARGE_CHECKER",
        "label": "ADJUSTMENT WORKINGCAPITALLOANCHARGE CHECKER"
      },
      {
        "code": "APPROVALUNDO_LOAN",
        "label": "APPROVALUNDO LOAN"
      },
      {
        "code": "APPROVALUNDO_LOAN_CHECKER",
        "label": "APPROVALUNDO LOAN CHECKER"
      },
      {
        "code": "APPROVE_LOAN",
        "label": "APPROVE LOAN"
      },
      {
        "code": "APPROVE_LOAN_CHECKER",
        "label": "APPROVE LOAN CHECKER"
      },
      {
        "code": "BULKREASSIGN_LOAN",
        "label": "BULKREASSIGN LOAN"
      },
      {
        "code": "BULKREASSIGN_LOAN_CHECKER",
        "label": "BULKREASSIGN LOAN CHECKER"
      },
      {
        "code": "BUYBACK_LOAN",
        "label": "BUYBACK LOAN"
      },
      {
        "code": "BUYDOWNFEE_LOAN",
        "label": "BUYDOWNFEE LOAN"
      },
      {
        "code": "BUYDOWNFEEADJUSTMENT_LOAN",
        "label": "BUYDOWNFEEADJUSTMENT LOAN"
      },
      {
        "code": "BYPASS_LOAN_WRITE_PROTECTION",
        "label": "BYPASS LOAN WRITE PROTECTION"
      },
      {
        "code": "CAPITALIZEDINCOME_LOAN",
        "label": "CAPITALIZEDINCOME LOAN"
      },
      {
        "code": "CAPITALIZEDINCOMEADJUSTMENT_LOAN",
        "label": "CAPITALIZEDINCOMEADJUSTMENT LOAN"
      },
      {
        "code": "CHARGEBACK_LOAN",
        "label": "CHARGEBACK LOAN"
      },
      {
        "code": "CHARGEOFF_LOAN",
        "label": "CHARGEOFF LOAN"
      },
      {
        "code": "CHARGEOFF_WORKINGCAPITALLOAN",
        "label": "CHARGEOFF WORKINGCAPITALLOAN"
      },
      {
        "code": "CHARGEREFUND_LOAN",
        "label": "CHARGEREFUND LOAN"
      },
      {
        "code": "CLOSE_LOAN",
        "label": "CLOSE LOAN"
      },
      {
        "code": "CLOSE_LOAN_CHECKER",
        "label": "CLOSE LOAN CHECKER"
      },
      {
        "code": "CLOSEASRESCHEDULED_LOAN",
        "label": "CLOSEASRESCHEDULED LOAN"
      },
      {
        "code": "CLOSEASRESCHEDULED_LOAN_CHECKER",
        "label": "CLOSEASRESCHEDULED LOAN CHECKER"
      },
      {
        "code": "CREDITBALANCEREFUND_LOAN",
        "label": "CREDITBALANCEREFUND LOAN"
      },
      {
        "code": "DISBURSALLASTUNDO_LOAN",
        "label": "DISBURSALLASTUNDO LOAN"
      },
      {
        "code": "DISBURSALLASTUNDO_LOAN_CHECKER",
        "label": "DISBURSALLASTUNDO LOAN CHECKER"
      },
      {
        "code": "DISBURSALUNDO_LOAN",
        "label": "DISBURSALUNDO LOAN"
      },
      {
        "code": "DISBURSALUNDO_LOAN_CHECKER",
        "label": "DISBURSALUNDO LOAN CHECKER"
      },
      {
        "code": "DISBURSE_LOAN",
        "label": "DISBURSE LOAN"
      },
      {
        "code": "DISBURSE_LOAN_CHECKER",
        "label": "DISBURSE LOAN CHECKER"
      },
      {
        "code": "DISBURSETOSAVINGS_LOAN",
        "label": "DISBURSETOSAVINGS LOAN"
      },
      {
        "code": "DISBURSEWITHOUTAUTODOWNPAYMENT_LOAN",
        "label": "DISBURSEWITHOUTAUTODOWNPAYMENT LOAN"
      },
      {
        "code": "DOWNPAYMENT_LOAN",
        "label": "DOWNPAYMENT LOAN"
      },
      {
        "code": "GOODWILLCREDIT_LOAN",
        "label": "GOODWILLCREDIT LOAN"
      },
      {
        "code": "INTERESTPAYMENTWAIVER_LOAN",
        "label": "INTERESTPAYMENTWAIVER LOAN"
      },
      {
        "code": "INTERMEDIARYSALE_LOAN",
        "label": "INTERMEDIARYSALE LOAN"
      },
      {
        "code": "MANUAL_INTEREST_REFUND_TRANSACTION_LOAN",
        "label": "MANUAL INTEREST REFUND TRANSACTION LOAN"
      },
      {
        "code": "MERCHANTISSUEDREFUND_LOAN",
        "label": "MERCHANTISSUEDREFUND LOAN"
      },
      {
        "code": "PAY_LOANCHARGE",
        "label": "PAY LOANCHARGE"
      },
      {
        "code": "PAYOUTREFUND_LOAN",
        "label": "PAYOUTREFUND LOAN"
      },
      {
        "code": "RECOVERYPAYMENT_LOAN",
        "label": "RECOVERYPAYMENT LOAN"
      },
      {
        "code": "REFUNDBYCASH_LOAN",
        "label": "REFUNDBYCASH LOAN"
      },
      {
        "code": "REFUNDBYCASH_LOAN_CHECKER",
        "label": "REFUNDBYCASH LOAN CHECKER"
      },
      {
        "code": "REJECT_LOAN",
        "label": "REJECT LOAN"
      },
      {
        "code": "REJECT_LOAN_CHECKER",
        "label": "REJECT LOAN CHECKER"
      },
      {
        "code": "REMOVELOANOFFICER_LOAN",
        "label": "REMOVELOANOFFICER LOAN"
      },
      {
        "code": "REMOVELOANOFFICER_LOAN_CHECKER",
        "label": "REMOVELOANOFFICER LOAN CHECKER"
      },
      {
        "code": "REPAYMENT_LOAN",
        "label": "REPAYMENT LOAN"
      },
      {
        "code": "REPAYMENT_LOAN_CHECKER",
        "label": "REPAYMENT LOAN CHECKER"
      },
      {
        "code": "SALE_LOAN",
        "label": "SALE LOAN"
      },
      {
        "code": "UNDO_WAIVECHARGE",
        "label": "UNDO WAIVECHARGE"
      },
      {
        "code": "UNDOCHARGEOFF_LOAN",
        "label": "UNDOCHARGEOFF LOAN"
      },
      {
        "code": "UNDOCHARGEOFF_WORKINGCAPITALLOAN",
        "label": "UNDOCHARGEOFF WORKINGCAPITALLOAN"
      },
      {
        "code": "UNDOWRITEOFF_LOAN",
        "label": "UNDOWRITEOFF LOAN"
      },
      {
        "code": "UNDOWRITEOFF_WORKINGCAPITALLOAN",
        "label": "UNDOWRITEOFF WORKINGCAPITALLOAN"
      },
      {
        "code": "UPDATE_APPROVED_AMOUNT_LOAN",
        "label": "UPDATE APPROVED AMOUNT LOAN"
      },
      {
        "code": "UPDATELOANOFFICER_LOAN",
        "label": "UPDATELOANOFFICER LOAN"
      },
      {
        "code": "UPDATELOANOFFICER_LOAN_CHECKER",
        "label": "UPDATELOANOFFICER LOAN CHECKER"
      },
      {
        "code": "WAIVEINTERESTPORTION_LOAN",
        "label": "WAIVEINTERESTPORTION LOAN"
      },
      {
        "code": "WAIVEINTERESTPORTION_LOAN_CHECKER",
        "label": "WAIVEINTERESTPORTION LOAN CHECKER"
      },
      {
        "code": "WITHDRAW_LOAN",
        "label": "WITHDRAW LOAN"
      },
      {
        "code": "WITHDRAW_LOAN_CHECKER",
        "label": "WITHDRAW LOAN CHECKER"
      },
      {
        "code": "WRITEOFF_LOAN",
        "label": "WRITEOFF LOAN"
      },
      {
        "code": "WRITEOFF_LOAN_CHECKER",
        "label": "WRITEOFF LOAN CHECKER"
      },
      {
        "code": "WRITEOFF_WORKINGCAPITALLOAN",
        "label": "WRITEOFF WORKINGCAPITALLOAN"
      }
    ]
  },
  {
    "id": "transaction_savings",
    "name": "Savings Transactions",
    "permissions": [
      {
        "code": "ACTIVATE_FIXEDDEPOSITACCOUNT",
        "label": "ACTIVATE FIXEDDEPOSITACCOUNT"
      },
      {
        "code": "ACTIVATE_FIXEDDEPOSITACCOUNT_CHECKER",
        "label": "ACTIVATE FIXEDDEPOSITACCOUNT CHECKER"
      },
      {
        "code": "ACTIVATE_RECURRINGDEPOSITACCOUNT",
        "label": "ACTIVATE RECURRINGDEPOSITACCOUNT"
      },
      {
        "code": "ACTIVATE_RECURRINGDEPOSITACCOUNT_CHECKER",
        "label": "ACTIVATE RECURRINGDEPOSITACCOUNT CHECKER"
      },
      {
        "code": "ACTIVATE_SAVINGSACCOUNT",
        "label": "ACTIVATE SAVINGSACCOUNT"
      },
      {
        "code": "ACTIVATE_SAVINGSACCOUNT_CHECKER",
        "label": "ACTIVATE SAVINGSACCOUNT CHECKER"
      },
      {
        "code": "ADJUSTTRANSACTION_FIXEDDEPOSITACCOUNT",
        "label": "ADJUSTTRANSACTION FIXEDDEPOSITACCOUNT"
      },
      {
        "code": "ADJUSTTRANSACTION_RECURRINGDEPOSITACCOUNT",
        "label": "ADJUSTTRANSACTION RECURRINGDEPOSITACCOUNT"
      },
      {
        "code": "ADJUSTTRANSACTION_SAVINGSACCOUNT",
        "label": "ADJUSTTRANSACTION SAVINGSACCOUNT"
      },
      {
        "code": "APPLYANNUALFEE_SAVINGSACCOUNT",
        "label": "APPLYANNUALFEE SAVINGSACCOUNT"
      },
      {
        "code": "APPLYANNUALFEE_SAVINGSACCOUNT_CHECKER",
        "label": "APPLYANNUALFEE SAVINGSACCOUNT CHECKER"
      },
      {
        "code": "APPROVALUNDO_FIXEDDEPOSITACCOUNT",
        "label": "APPROVALUNDO FIXEDDEPOSITACCOUNT"
      },
      {
        "code": "APPROVALUNDO_FIXEDDEPOSITACCOUNT_CHECKER",
        "label": "APPROVALUNDO FIXEDDEPOSITACCOUNT CHECKER"
      },
      {
        "code": "APPROVALUNDO_RECURRINGDEPOSITACCOUNT",
        "label": "APPROVALUNDO RECURRINGDEPOSITACCOUNT"
      },
      {
        "code": "APPROVALUNDO_RECURRINGDEPOSITACCOUNT_CHECKER",
        "label": "APPROVALUNDO RECURRINGDEPOSITACCOUNT CHECKER"
      },
      {
        "code": "APPROVALUNDO_SAVINGSACCOUNT",
        "label": "APPROVALUNDO SAVINGSACCOUNT"
      },
      {
        "code": "APPROVALUNDO_SAVINGSACCOUNT_CHECKER",
        "label": "APPROVALUNDO SAVINGSACCOUNT CHECKER"
      },
      {
        "code": "APPROVE_FIXEDDEPOSITACCOUNT",
        "label": "APPROVE FIXEDDEPOSITACCOUNT"
      },
      {
        "code": "APPROVE_FIXEDDEPOSITACCOUNT_CHECKER",
        "label": "APPROVE FIXEDDEPOSITACCOUNT CHECKER"
      },
      {
        "code": "APPROVE_RECURRINGDEPOSITACCOUNT",
        "label": "APPROVE RECURRINGDEPOSITACCOUNT"
      },
      {
        "code": "APPROVE_RECURRINGDEPOSITACCOUNT_CHECKER",
        "label": "APPROVE RECURRINGDEPOSITACCOUNT CHECKER"
      },
      {
        "code": "APPROVE_SAVINGSACCOUNT",
        "label": "APPROVE SAVINGSACCOUNT"
      },
      {
        "code": "APPROVE_SAVINGSACCOUNT_CHECKER",
        "label": "APPROVE SAVINGSACCOUNT CHECKER"
      },
      {
        "code": "BLOCK_SAVINGSACCOUNT",
        "label": "BLOCK SAVINGSACCOUNT"
      },
      {
        "code": "BLOCK_SAVINGSACCOUNT_CHECKER",
        "label": "BLOCK SAVINGSACCOUNT CHECKER"
      },
      {
        "code": "BLOCKCREDIT_SAVINGSACCOUNT",
        "label": "BLOCKCREDIT SAVINGSACCOUNT"
      },
      {
        "code": "BLOCKCREDIT_SAVINGSACCOUNT_CHECKER",
        "label": "BLOCKCREDIT SAVINGSACCOUNT CHECKER"
      },
      {
        "code": "BLOCKDEBIT_SAVINGSACCOUNT",
        "label": "BLOCKDEBIT SAVINGSACCOUNT"
      },
      {
        "code": "BLOCKDEBIT_SAVINGSACCOUNT_CHECKER",
        "label": "BLOCKDEBIT SAVINGSACCOUNT CHECKER"
      },
      {
        "code": "CALCULATEINTEREST_FIXEDDEPOSITACCOUNT",
        "label": "CALCULATEINTEREST FIXEDDEPOSITACCOUNT"
      },
      {
        "code": "CALCULATEINTEREST_FIXEDDEPOSITACCOUNT_CHECKER",
        "label": "CALCULATEINTEREST FIXEDDEPOSITACCOUNT CHECKER"
      },
      {
        "code": "CALCULATEINTEREST_RECURRINGDEPOSITACCOUNT",
        "label": "CALCULATEINTEREST RECURRINGDEPOSITACCOUNT"
      },
      {
        "code": "CALCULATEINTEREST_RECURRINGDEPOSITACCOUNT_CHECKER",
        "label": "CALCULATEINTEREST RECURRINGDEPOSITACCOUNT CHECKER"
      },
      {
        "code": "CALCULATEINTEREST_SAVINGSACCOUNT",
        "label": "CALCULATEINTEREST SAVINGSACCOUNT"
      },
      {
        "code": "CALCULATEINTEREST_SAVINGSACCOUNT_CHECKER",
        "label": "CALCULATEINTEREST SAVINGSACCOUNT CHECKER"
      },
      {
        "code": "CLOSE_FIXEDDEPOSITACCOUNT",
        "label": "CLOSE FIXEDDEPOSITACCOUNT"
      },
      {
        "code": "CLOSE_FIXEDDEPOSITACCOUNT_CHECKER",
        "label": "CLOSE FIXEDDEPOSITACCOUNT CHECKER"
      },
      {
        "code": "CLOSE_RECURRINGDEPOSITACCOUNT",
        "label": "CLOSE RECURRINGDEPOSITACCOUNT"
      },
      {
        "code": "CLOSE_RECURRINGDEPOSITACCOUNT_CHECKER",
        "label": "CLOSE RECURRINGDEPOSITACCOUNT CHECKER"
      },
      {
        "code": "CLOSE_SAVINGSACCOUNT",
        "label": "CLOSE SAVINGSACCOUNT"
      },
      {
        "code": "CLOSE_SAVINGSACCOUNT_CHECKER",
        "label": "CLOSE SAVINGSACCOUNT CHECKER"
      },
      {
        "code": "CREATE_ACCOUNTTRANSFER",
        "label": "CREATE ACCOUNTTRANSFER"
      },
      {
        "code": "CREATE_ACCOUNTTRANSFER_CHECKER",
        "label": "CREATE ACCOUNTTRANSFER CHECKER"
      },
      {
        "code": "DEPOSIT_FIXEDDEPOSITACCOUNT",
        "label": "DEPOSIT FIXEDDEPOSITACCOUNT"
      },
      {
        "code": "DEPOSIT_FIXEDDEPOSITACCOUNT_CHECKER",
        "label": "DEPOSIT FIXEDDEPOSITACCOUNT CHECKER"
      },
      {
        "code": "DEPOSIT_RECURRINGDEPOSITACCOUNT",
        "label": "DEPOSIT RECURRINGDEPOSITACCOUNT"
      },
      {
        "code": "DEPOSIT_RECURRINGDEPOSITACCOUNT_CHECKER",
        "label": "DEPOSIT RECURRINGDEPOSITACCOUNT CHECKER"
      },
      {
        "code": "DEPOSIT_SAVINGSACCOUNT",
        "label": "DEPOSIT SAVINGSACCOUNT"
      },
      {
        "code": "DEPOSIT_SAVINGSACCOUNT_CHECKER",
        "label": "DEPOSIT SAVINGSACCOUNT CHECKER"
      },
      {
        "code": "HOLDAMOUNT_SAVINGSACCOUNT",
        "label": "HOLDAMOUNT SAVINGSACCOUNT"
      },
      {
        "code": "HOLDAMOUNT_SAVINGSACCOUNT_CHECKER",
        "label": "HOLDAMOUNT SAVINGSACCOUNT CHECKER"
      },
      {
        "code": "POSTINTEREST_FIXEDDEPOSITACCOUNT",
        "label": "POSTINTEREST FIXEDDEPOSITACCOUNT"
      },
      {
        "code": "POSTINTEREST_FIXEDDEPOSITACCOUNT_CHECKER",
        "label": "POSTINTEREST FIXEDDEPOSITACCOUNT CHECKER"
      },
      {
        "code": "POSTINTEREST_RECURRINGDEPOSITACCOUNT",
        "label": "POSTINTEREST RECURRINGDEPOSITACCOUNT"
      },
      {
        "code": "POSTINTEREST_RECURRINGDEPOSITACCOUNT_CHECKER",
        "label": "POSTINTEREST RECURRINGDEPOSITACCOUNT CHECKER"
      },
      {
        "code": "POSTINTEREST_SAVINGSACCOUNT",
        "label": "POSTINTEREST SAVINGSACCOUNT"
      },
      {
        "code": "POSTINTEREST_SAVINGSACCOUNT_CHECKER",
        "label": "POSTINTEREST SAVINGSACCOUNT CHECKER"
      },
      {
        "code": "POSTINTERESTASONDATE_SAVINGSACCOUNT",
        "label": "POSTINTERESTASONDATE SAVINGSACCOUNT"
      },
      {
        "code": "POSTINTERESTASONDATE_SAVINGSACCOUNT_CHECKER",
        "label": "POSTINTERESTASONDATE SAVINGSACCOUNT CHECKER"
      },
      {
        "code": "PREMATURECLOSE_FIXEDDEPOSITACCOUNT",
        "label": "PREMATURECLOSE FIXEDDEPOSITACCOUNT"
      },
      {
        "code": "PREMATURECLOSE_FIXEDDEPOSITACCOUNT_CHECKER",
        "label": "PREMATURECLOSE FIXEDDEPOSITACCOUNT CHECKER"
      },
      {
        "code": "PREMATURECLOSE_RECURRINGDEPOSITACCOUNT",
        "label": "PREMATURECLOSE RECURRINGDEPOSITACCOUNT"
      },
      {
        "code": "PREMATURECLOSE_RECURRINGDEPOSITACCOUNT_CHECKER",
        "label": "PREMATURECLOSE RECURRINGDEPOSITACCOUNT CHECKER"
      },
      {
        "code": "READ_ACCOUNTTRANSFER",
        "label": "READ ACCOUNTTRANSFER"
      },
      {
        "code": "REFUNDBYTRANSFER_ACCOUNTTRANSFER",
        "label": "REFUNDBYTRANSFER ACCOUNTTRANSFER"
      },
      {
        "code": "REFUNDBYTRANSFER_ACCOUNTTRANSFER_CHECKER",
        "label": "REFUNDBYTRANSFER ACCOUNTTRANSFER CHECKER"
      },
      {
        "code": "REJECT_FIXEDDEPOSITACCOUNT",
        "label": "REJECT FIXEDDEPOSITACCOUNT"
      },
      {
        "code": "REJECT_FIXEDDEPOSITACCOUNT_CHECKER",
        "label": "REJECT FIXEDDEPOSITACCOUNT CHECKER"
      },
      {
        "code": "REJECT_RECURRINGDEPOSITACCOUNT",
        "label": "REJECT RECURRINGDEPOSITACCOUNT"
      },
      {
        "code": "REJECT_RECURRINGDEPOSITACCOUNT_CHECKER",
        "label": "REJECT RECURRINGDEPOSITACCOUNT CHECKER"
      },
      {
        "code": "REJECT_SAVINGSACCOUNT",
        "label": "REJECT SAVINGSACCOUNT"
      },
      {
        "code": "REJECT_SAVINGSACCOUNT_CHECKER",
        "label": "REJECT SAVINGSACCOUNT CHECKER"
      },
      {
        "code": "RELEASEAMOUNT_SAVINGSACCOUNT",
        "label": "RELEASEAMOUNT SAVINGSACCOUNT"
      },
      {
        "code": "RELEASEAMOUNT_SAVINGSACCOUNT_CHECKER",
        "label": "RELEASEAMOUNT SAVINGSACCOUNT CHECKER"
      },
      {
        "code": "REVERSETRANSACTION_SAVINGSACCOUNT",
        "label": "REVERSETRANSACTION SAVINGSACCOUNT"
      },
      {
        "code": "REVERSETRANSACTION_SAVINGSACCOUNT_CHECKER",
        "label": "REVERSETRANSACTION SAVINGSACCOUNT CHECKER"
      },
      {
        "code": "UNBLOCK_SAVINGSACCOUNT",
        "label": "UNBLOCK SAVINGSACCOUNT"
      },
      {
        "code": "UNBLOCK_SAVINGSACCOUNT_CHECKER",
        "label": "UNBLOCK SAVINGSACCOUNT CHECKER"
      },
      {
        "code": "UNBLOCKCREDIT_SAVINGSACCOUNT",
        "label": "UNBLOCKCREDIT SAVINGSACCOUNT"
      },
      {
        "code": "UNBLOCKCREDIT_SAVINGSACCOUNT_CHECKER",
        "label": "UNBLOCKCREDIT SAVINGSACCOUNT CHECKER"
      },
      {
        "code": "UNBLOCKDEBIT_SAVINGSACCOUNT",
        "label": "UNBLOCKDEBIT SAVINGSACCOUNT"
      },
      {
        "code": "UNBLOCKDEBIT_SAVINGSACCOUNT_CHECKER",
        "label": "UNBLOCKDEBIT SAVINGSACCOUNT CHECKER"
      },
      {
        "code": "UNDOTRANSACTION_FIXEDDEPOSITACCOUNT",
        "label": "UNDOTRANSACTION FIXEDDEPOSITACCOUNT"
      },
      {
        "code": "UNDOTRANSACTION_FIXEDDEPOSITACCOUNT_CHECKER",
        "label": "UNDOTRANSACTION FIXEDDEPOSITACCOUNT CHECKER"
      },
      {
        "code": "UNDOTRANSACTION_RECURRINGDEPOSITACCOUNT",
        "label": "UNDOTRANSACTION RECURRINGDEPOSITACCOUNT"
      },
      {
        "code": "UNDOTRANSACTION_RECURRINGDEPOSITACCOUNT_CHECKER",
        "label": "UNDOTRANSACTION RECURRINGDEPOSITACCOUNT CHECKER"
      },
      {
        "code": "UNDOTRANSACTION_SAVINGSACCOUNT",
        "label": "UNDOTRANSACTION SAVINGSACCOUNT"
      },
      {
        "code": "UNDOTRANSACTION_SAVINGSACCOUNT_CHECKER",
        "label": "UNDOTRANSACTION SAVINGSACCOUNT CHECKER"
      },
      {
        "code": "UPDATEDEPOSITAMOUNT_RECURRINGDEPOSITACCOUNT",
        "label": "UPDATEDEPOSITAMOUNT RECURRINGDEPOSITACCOUNT"
      },
      {
        "code": "UPDATEDEPOSITAMOUNT_RECURRINGDEPOSITACCOUNT_CHECKER",
        "label": "UPDATEDEPOSITAMOUNT RECURRINGDEPOSITACCOUNT CHECKER"
      },
      {
        "code": "WITHDRAW_FIXEDDEPOSITACCOUNT",
        "label": "WITHDRAW FIXEDDEPOSITACCOUNT"
      },
      {
        "code": "WITHDRAW_FIXEDDEPOSITACCOUNT_CHECKER",
        "label": "WITHDRAW FIXEDDEPOSITACCOUNT CHECKER"
      },
      {
        "code": "WITHDRAW_RECURRINGDEPOSITACCOUNT",
        "label": "WITHDRAW RECURRINGDEPOSITACCOUNT"
      },
      {
        "code": "WITHDRAW_RECURRINGDEPOSITACCOUNT_CHECKER",
        "label": "WITHDRAW RECURRINGDEPOSITACCOUNT CHECKER"
      },
      {
        "code": "WITHDRAW_SAVINGSACCOUNT",
        "label": "WITHDRAW SAVINGSACCOUNT"
      },
      {
        "code": "WITHDRAW_SAVINGSACCOUNT_CHECKER",
        "label": "WITHDRAW SAVINGSACCOUNT CHECKER"
      },
      {
        "code": "WITHDRAWAL_FIXEDDEPOSITACCOUNT",
        "label": "WITHDRAWAL FIXEDDEPOSITACCOUNT"
      },
      {
        "code": "WITHDRAWAL_FIXEDDEPOSITACCOUNT_CHECKER",
        "label": "WITHDRAWAL FIXEDDEPOSITACCOUNT CHECKER"
      },
      {
        "code": "WITHDRAWAL_RECURRINGDEPOSITACCOUNT",
        "label": "WITHDRAWAL RECURRINGDEPOSITACCOUNT"
      },
      {
        "code": "WITHDRAWAL_RECURRINGDEPOSITACCOUNT_CHECKER",
        "label": "WITHDRAWAL RECURRINGDEPOSITACCOUNT CHECKER"
      },
      {
        "code": "WITHDRAWAL_SAVINGSACCOUNT",
        "label": "WITHDRAWAL SAVINGSACCOUNT"
      },
      {
        "code": "WITHDRAWAL_SAVINGSACCOUNT_CHECKER",
        "label": "WITHDRAWAL SAVINGSACCOUNT CHECKER"
      }
    ]
  }
];

export const INITIAL_ROLE_PERMISSIONS = {
  "1": [
    "ALL_FUNCTIONS",
    "FORCE_WITHDRAWAL_SAVINGSACCOUNT",
    "FORCE_WITHDRAWAL_SAVINGSACCOUNT_CHECKER"
  ],
  "4": [
    "READ_GLACCOUNT",
    "CREATE_JOURNALENTRY",
    "READ_GLCLOSURE",
    "READ_JOURNALENTRY",
    "READ_ACCOUNTINGRULE",
    "READ_FINANCIALACTIVITYACCOUNT",
    "READ_OFFICE"
  ],
  "5": [
    "READ_OFFICE"
  ],
  "7": [
    "CREATE_ACCOUNTINGRULE",
    "CREATE_GLCLOSURE",
    "READ_GLCLOSURE",
    "READ_GLACCOUNT",
    "CREATE_GLACCOUNT",
    "UPDATE_GLACCOUNT",
    "READ_ACCOUNTINGRULE",
    "READ_FINANCIALACTIVITYACCOUNT",
    "READ_JOURNALENTRY",
    "UPDATE_ACCOUNTINGRULE",
    "READ_OFFICE"
  ],
  "8": [
    "READ_OFFICE",
    "READ_SAVINGSACCOUNT",
    "READ_SAVINGSPRODUCT",
    "DEPOSIT_SAVINGSACCOUNT",
    "READ_CLIENT",
    "CREATE_SAVINGSACCOUNT"
  ],
  "9": [
    "REJECT_SAVINGSACCOUNT",
    "READ_CLIENT",
    "APPROVE_SAVINGSACCOUNT",
    "READ_SAVINGSACCOUNT",
    "ACTIVATE_SAVINGSACCOUNT",
    "READ_OFFICE"
  ],
  "10": [
    "READ_LOAN",
    "UPDATE_LOAN",
    "CREATE_LOAN",
    "READ_CLIENT",
    "READ_OFFICE"
  ],
  "11": [
    "READ_LOAN",
    "READ_CLIENT",
    "READ_OFFICE"
  ],
  "12": [
    "READ_CLIENT",
    "DEPOSIT_SAVINGSACCOUNT",
    "READ_SAVINGSACCOUNT",
    "WITHDRAWAL_SAVINGSACCOUNT",
    "READ_OFFICE"
  ],
  "13": [
    "READ_OFFICE",
    "ALLOCATECASHTOCASHIER_TELLER",
    "SETTLECASHFROMCASHIER_TELLER",
    "ALLOCATECASHIER_TELLER",
    "CREATE_TELLER",
    "READ_STAFF"
  ],
  "14": [
    "READ_OFFICE",
    "UPDATE_CLIENTCHARGE",
    "CREATE_CLIENTCHARGE",
    "READ_CLIENTIDENTIFIER",
    "READ_CLIENT"
  ],
  "16": [
    "READ_OFFICE",
    "READ_USER",
    "READ_ROLE",
    "READ_CONFIGURATION"
  ],
  "17": [
    "UPDATE_USER",
    "READ_OFFICE",
    "CREATE_USER",
    "READ_USER",
    "READ_ROLE"
  ],
  "18": [
    "READ_ACCOUNTINGRULE",
    "READ_JOURNALENTRY",
    "READ_LOAN",
    "READ_GLACCOUNT",
    "READ_AUDIT",
    "READ_CLIENT",
    "READ_GLCLOSURE",
    "READ_OFFICE",
    "READ_SAVINGSACCOUNT"
  ]
};

// ============================================================================
// DANH MỤC 8 PHÒNG BAN & CẤU HÌNH PHÂN QUYỀN VAI TRÒ CHUẨN MIFOS X
// ============================================================================
export const BANK_DEPARTMENTS_CONFIG = [
  {
    departmentId: 'internal-audit',
    departmentName: '1. Internal Audit (Kiểm toán nội bộ)',
    rolesCount: '1 Role',
    description: 'Giám sát, kiểm toán độc lập toàn bộ hoạt động ngân hàng mà không có quyền chỉnh sửa dữ liệu.',
    roles: [
      {
        id: '18',
        name: 'TKB_AUDITOR_READONLY',
        isDemo: true, // Đại diện biểu diễn phòng 1
        description: 'Responsible for independently reviewing accounting and operational records without modification rights.',
        tabs: [
          {
            tabId: 'accounting',
            tabName: 'Accounting',
            permissions: ['READ_ACCOUNTINGRULE', 'READ_JOURNALENTRY', 'READ_GLACCOUNT', 'READ_GLCLOSURE']
          },
          {
            tabId: 'portfolio',
            tabName: 'Portfolio',
            permissions: ['READ_LOAN', 'READ_CLIENT', 'READ_SAVINGSACCOUNT']
          },
          {
            tabId: 'organisation',
            tabName: 'Organisation',
            permissions: ['READ_OFFICE']
          },
          {
            tabId: 'configuration',
            tabName: 'Configuration',
            permissions: ['READ_AUDIT']
          }
        ]
      }
    ]
  },
  {
    departmentId: 'accounting-finance',
    departmentName: '2. Accounting & Finance (Kế toán & Tài chính)',
    rolesCount: '3 Roles',
    description: 'Maker tạo bút toán, Checker kiểm tra/phê duyệt khi Maker-Checker được kích hoạt; Manager quản trị hệ thống kế toán.',
    roles: [
      {
        id: '4',
        name: 'TKB_ACCOUNTING_MAKER',
        isDemo: true, // Đại diện biểu diễn phòng 2
        description: 'Responsible for initiating accounting transactions and journal entries, subject to approval by authorized accounting checkers.',
        tabs: [
          {
            tabId: 'accounting',
            tabName: 'Accounting',
            permissions: ['READ_GLACCOUNT', 'READ_JOURNALENTRY', 'CREATE_JOURNALENTRY', 'READ_ACCOUNTINGRULE']
          },
          {
            tabId: 'organisation',
            tabName: 'Organisation',
            permissions: ['READ_OFFICE']
          }
        ]
      },
      {
        id: '5',
        name: 'TKB_ACCOUNTING_CHECKER',
        isDemo: false,
        description: 'Responsible for reviewing, approving, or rejecting accounting transactions initiated by authorized makers, ensuring accuracy and compliance.',
        tabs: [
          {
            tabId: 'accounting',
            tabName: 'Accounting',
            permissions: ['READ_GLACCOUNT', 'READ_JOURNALENTRY', 'CREATE_JOURNALENTRY_CHECKER']
          },
          {
            tabId: 'organisation',
            tabName: 'Organisation',
            permissions: ['READ_OFFICE']
          }
        ]
      },
      {
        id: '7',
        name: 'TKB_ACCOUNTING_MANAGER',
        isDemo: false,
        description: 'Responsible for overseeing accounting operations, managing authorized accounting configurations, monitoring financial transactions.',
        tabs: [
          {
            tabId: 'accounting',
            tabName: 'Accounting',
            permissions: [
              'READ_GLACCOUNT', 'READ_JOURNALENTRY', 'CREATE_GLACCOUNT', 'UPDATE_GLACCOUNT',
              'READ_ACCOUNTINGRULE', 'CREATE_ACCOUNTINGRULE', 'UPDATE_ACCOUNTINGRULE',
              'READ_GLCLOSURE', 'CREATE_GLCLOSURE'
            ]
          },
          {
            tabId: 'organisation',
            tabName: 'Organisation',
            permissions: ['READ_OFFICE']
          }
        ]
      }
    ]
  },
  {
    departmentId: 'savings-deposits',
    departmentName: '3. Savings & Deposits (Tiền gửi & Tiết kiệm)',
    rolesCount: '2 Roles',
    description: 'Officer mở tài khoản, thực hiện nghiệp vụ được phép; Supervisor phê duyệt và kích hoạt tài khoản tiết kiệm.',
    roles: [
      {
        id: '8',
        name: 'TKB_SAVINGS_OFFICER',
        isDemo: true, // Đại diện biểu diễn phòng 3
        description: 'Responsible for initiating and maintaining authorized customer savings operations.',
        tabs: [
          {
            tabId: 'portfolio',
            tabName: 'Portfolio',
            permissions: ['READ_CLIENT', 'READ_SAVINGSACCOUNT', 'CREATE_SAVINGSACCOUNT']
          },
          {
            tabId: 'organisation',
            tabName: 'Organisation',
            permissions: ['READ_SAVINGSPRODUCT', 'READ_OFFICE']
          },
          {
            tabId: 'transaction_savings',
            tabName: 'Savings Transactions',
            permissions: ['DEPOSIT_SAVINGSACCOUNT']
          }
        ]
      },
      {
        id: '9',
        name: 'TKB_SAVINGS_SUPERVISOR',
        isDemo: false,
        description: 'Responsible for reviewing and supervising customer deposit operations.',
        tabs: [
          {
            tabId: 'portfolio',
            tabName: 'Portfolio',
            permissions: ['READ_CLIENT', 'READ_SAVINGSACCOUNT']
          },
          {
            tabId: 'transaction_savings',
            tabName: 'Savings Transactions',
            permissions: ['APPROVE_SAVINGSACCOUNT', 'ACTIVATE_SAVINGSACCOUNT', 'REJECT_SAVINGSACCOUNT']
          },
          {
            tabId: 'organisation',
            tabName: 'Organisation',
            permissions: ['READ_OFFICE']
          }
        ]
      }
    ]
  },
  {
    departmentId: 'credit-loans',
    departmentName: '4. Credit & Loans (Tín dụng & Cho vay)',
    rolesCount: '2 Roles',
    description: 'Loan Officer lập hồ sơ vay, Loan Approver xét duyệt hoặc từ chối khoản vay.',
    roles: [
      {
        id: '10',
        name: 'TKB_LOAN_OFFICER',
        isDemo: true, // Đại diện biểu diễn phòng 4
        description: 'Responsible for initiating loan applications and maintaining assigned loan portfolios.',
        tabs: [
          {
            tabId: 'portfolio',
            tabName: 'Portfolio',
            permissions: ['READ_CLIENT', 'CREATE_LOAN', 'READ_LOAN', 'UPDATE_LOAN']
          },
          {
            tabId: 'organisation',
            tabName: 'Organisation',
            permissions: ['READ_OFFICE']
          }
        ]
      },
      {
        id: '11',
        name: 'TKB_LOAN_APPROVER',
        isDemo: false,
        description: 'Responsible for reviewing and approving eligible loan applications within assigned authority.',
        tabs: [
          {
            tabId: 'portfolio',
            tabName: 'Portfolio',
            permissions: ['READ_CLIENT', 'READ_LOAN']
          },
          {
            tabId: 'organisation',
            tabName: 'Organisation',
            permissions: ['READ_OFFICE']
          }
        ]
      }
    ]
  },
  {
    departmentId: 'treasury-cash',
    departmentName: '5. Treasury & Cash Management (Quản lý ngân quỹ & Tiền mặt)',
    rolesCount: '2 Roles',
    description: 'Teller tiếp nhận và xử lý giao dịch tiền mặt được ủy quyền; Cash Supervisor quản lý quầy, phân công Cashier, cấp và thu hồi tiền.',
    roles: [
      {
        id: '12',
        name: 'TKB_TELLER_CASHIER',
        isDemo: true, // Đại diện biểu diễn phòng 5
        description: 'Responsible for authorized cash transactions and teller operations.',
        tabs: [
          {
            tabId: 'portfolio',
            tabName: 'Portfolio',
            permissions: ['READ_CLIENT', 'READ_SAVINGSACCOUNT']
          },
          {
            tabId: 'transaction_savings',
            tabName: 'Savings Transactions',
            permissions: ['DEPOSIT_SAVINGSACCOUNT', 'WITHDRAWAL_SAVINGSACCOUNT']
          },
          {
            tabId: 'organisation',
            tabName: 'Organisation',
            permissions: ['READ_OFFICE']
          }
        ]
      },
      {
        id: '13',
        name: 'TKB_CASH_SUPERVISOR',
        isDemo: false,
        description: 'Responsible for supervising teller cash management and cash allocation activities.',
        tabs: [
          {
            tabId: 'cash_mgmt',
            tabName: 'Cash_mgmt',
            permissions: [
              'CREATE_TELLER', 'ALLOCATECASHIER_TELLER',
              'ALLOCATECASHTOCASHIER_TELLER', 'SETTLECASHFROMCASHIER_TELLER'
            ]
          },
          {
            tabId: 'organisation',
            tabName: 'Organisation',
            permissions: ['READ_STAFF', 'READ_OFFICE']
          }
        ]
      }
    ]
  },
  {
    departmentId: 'customer-service',
    departmentName: '6. Customer Service (Dịch vụ khách hàng)',
    rolesCount: '1 Role',
    description: 'Tạo và cập nhật hồ sơ khách hàng (CIF), tra cứu thông tin định danh và hỗ trợ khách hàng tại chi nhánh.',
    roles: [
      {
        id: '14',
        name: 'TKB_CUSTOMER_SERVICE',
        isDemo: true, // Đại diện biểu diễn phòng 6
        description: 'Responsible for creating and maintaining customer information within assigned authority.',
        tabs: [
          {
            tabId: 'portfolio',
            tabName: 'Portfolio',
            permissions: ['READ_CLIENT', 'CREATE_CLIENT', 'UPDATE_CLIENT', 'READ_CLIENTIDENTIFIER']
          },
          {
            tabId: 'organisation',
            tabName: 'Organisation',
            permissions: ['READ_OFFICE']
          }
        ]
      }
    ]
  },
  {
    departmentId: 'risk-compliance',
    departmentName: '7. Risk & Compliance (Quản trị rủi ro & Tuân thủ)',
    rolesCount: '1 Role',
    description: 'Theo dõi thông tin khách hàng, danh mục cho vay và tiền gửi phục vụ đánh giá rủi ro.',
    roles: [
      {
        id: '15',
        name: 'TKB_RISK_VIEWER',
        isDemo: true, // Đại diện biểu diễn phòng 7
        description: 'Responsible for reviewing financial and portfolio information for risk monitoring purposes.',
        tabs: [
          {
            tabId: 'portfolio',
            tabName: 'Portfolio',
            permissions: ['READ_CLIENT', 'READ_LOAN', 'READ_SAVINGSACCOUNT']
          },
          {
            tabId: 'organisation',
            tabName: 'Organisation',
            permissions: ['READ_OFFICE']
          }
        ]
      }
    ]
  },
  {
    departmentId: 'it-admin',
    departmentName: '8. IT & Administration (Công nghệ thông tin & Quản trị hệ thống)',
    rolesCount: '2 Roles',
    description: 'IT Support xem thông tin để hỗ trợ kỹ thuật; User Admin tạo và cấp quyền tài khoản nhân viên.',
    roles: [
      {
        id: '17',
        name: 'TKB_USER_ADMIN',
        isDemo: true, // Đại diện biểu diễn phòng 8
        description: 'Responsible for creating and maintaining application users and assigning authorized roles.',
        tabs: [
          {
            tabId: 'authorisation',
            tabName: 'Authorisation',
            permissions: ['READ_USER', 'CREATE_USER', 'UPDATE_USER', 'READ_ROLE']
          },
          {
            tabId: 'organisation',
            tabName: 'Organisation',
            permissions: ['READ_OFFICE']
          }
        ]
      },
      {
        id: '16',
        name: 'TKB_IT_SUPPORT',
        isDemo: false,
        description: 'Responsible for viewing system information and supporting authorized operational activities.',
        tabs: [
          {
            tabId: 'authorisation',
            tabName: 'Authorisation',
            permissions: ['READ_USER', 'READ_ROLE']
          },
          {
            tabId: 'configuration',
            tabName: 'Configuration',
            permissions: ['READ_CONFIGURATION']
          },
          {
            tabId: 'organisation',
            tabName: 'Organisation',
            permissions: ['READ_OFFICE']
          }
        ]
      }
    ]
  }
];

// Danh sách các vai trò biểu diễn (1 vai trò mỗi phòng ban)
export const ALL_DEMO_ROLES = BANK_DEPARTMENTS_CONFIG.flatMap(dept => 
  dept.roles.filter(r => r.isDemo).map(r => ({
    ...r,
    departmentName: dept.departmentName
  }))
);

// Danh sách các vai trò còn lại cần hiển thị cuối thực hành
export const ALL_REMAINING_ROLES = BANK_DEPARTMENTS_CONFIG.flatMap(dept => 
  dept.roles.filter(r => !r.isDemo).map(r => ({
    ...r,
    departmentName: dept.departmentName
  }))
);

// Map toàn bộ quyền hoàn chỉnh của cả 16 vai trò ngân hàng
export const FULL_CONFIGURED_ROLE_PERMISSIONS = (() => {
  const map = { ...INITIAL_ROLE_PERMISSIONS };
  BANK_DEPARTMENTS_CONFIG.forEach(dept => {
    dept.roles.forEach(role => {
      const allPerms = [];
      role.tabs.forEach(t => allPerms.push(...t.permissions));
      map[String(role.id)] = Array.from(new Set(allPerms));
    });
  });
  return map;
})();
