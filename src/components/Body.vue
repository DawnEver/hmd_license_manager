<template>
<v-card flat>
    <v-card-title class="d-flex align-center pe-2">

      <!-- toolbar -->
      <!-- pull -->
      <v-btn
        variant="plain"
        prepend-icon="mdi-download"
        @click="pullLicense"
      >
        {{ $t("get_all") }}
      </v-btn>
      <!-- new -->
      <v-btn
        variant="plain"
        prepend-icon="mdi-folder-plus"
        @click="showNewDialog = true"
      >
        {{ $t("new") }}
      </v-btn>
      <!-- modify -->
      <v-btn
        variant="plain"
        prepend-icon="mdi-pencil"
        @click="modifyLicense"
      >
        {{ $t("modify") }}
      </v-btn>
      <!-- delete -->
      <v-btn
        variant="plain"
        prepend-icon="mdi-delete"
        @click="deleteLicense"
      >
        {{ $t("delete") }}
      </v-btn>
      <!-- export -->
      <v-btn
        variant="plain"
        prepend-icon="mdi-export-variant"
        @click="exportLicense"
      >
        {{ $t("export") }}
      </v-btn>
      <v-spacer></v-spacer>
      <!-- search -->
      <v-text-field
        v-model="search"
        density="compact"
        label="Search"
        prepend-inner-icon="mdi-magnify"
        variant="solo-filled"
        flat
        hide-details
        single-line
      ></v-text-field>
    </v-card-title>

    <!-- table -->
    <!-- https://vuetifyjs.com/en/components/data-tables/data-and-display -->
    <v-data-table
    :headers="headers"
    :items="licenseList"
    v-model:search="search"
    v-model:sort-by="sortBy"
    show-select
    fixed-header
    hover
    >
    <template v-slot:header.data-table-select="{ allSelected, selectAll, someSelected }">
      <v-checkbox-btn
        :indeterminate="someSelected && !allSelected"
        :model-value="allSelected"
        color="primary"
        @update:model-value="selectAll(!allSelected)"
      ></v-checkbox-btn>
    </template>

    <template v-slot:item.data-table-select="{ internalItem, isSelected, toggleSelect }">
      <v-checkbox-btn
        :model-value="isSelected(internalItem)"
        color="primary"
        @update:model-value="toggleSelect(internalItem)"
      ></v-checkbox-btn>
    </template>
  </v-data-table>

  <!-- dialog -->
  <!-- https://vuetifyjs.com/en/components/dialogs/ -->
  <!-- msg dialog -->
  <v-dialog
      v-model="showMsgDialog"
      min-width="400px"
    >
      <v-card
        prepend-icon="mdi-message-alert"
        :text="msgDialogText"
        title="MESSAGE"
      >
        <template v-slot:actions>
          <v-btn
            class="ms-auto"
            @click="showMsgDialog = false"
            prepend-icon="mdi-check-circle"
          >
            {{ $t("ok") }}
          </v-btn>
        </template>
      </v-card>
  </v-dialog>
  <!-- new dialog -->
  <v-dialog
      v-model="showNewDialog"
      min-width="400px"
    >
      <v-card
        prepend-icon="mdi-folder-plus"
        title="NEW"
      >
        <v-text-field
          min=0
          label="Batch Size"
          v-model="newLicenseDict.batchSize"
        ></v-text-field>
        <v-text-field
          min=0
          label="Group Name"
          v-model="newLicenseDict.groupName"
        ></v-text-field>
        <v-text-field
          min=0
          label="Comment"
          v-model="newLicenseDict.comment"
        ></v-text-field>
        <template v-slot:actions>
          <v-spacer></v-spacer>
          <v-btn
            class="ms-auto"
            @click="showNewDialog = false"
            prepend-icon="mdi-close-thick"
          >
            {{ $t("cancel") }}
          </v-btn>
          <v-btn
            class="ms-auto"
            @click="newLicense"
            prepend-icon="mdi-folder-plus"
          >
            {{ $t("new") }}
          </v-btn>
        </template>
      </v-card>
  </v-dialog>


  <!-- password input -->
  <v-otp-input
      v-model="password"
      length="5"
      placeholder="0"
      variant="underlined"
    ></v-otp-input>
</v-card>
</template>


<script setup>
import { ref } from 'vue'

const search = ref('');
const sortBy = ref([{ key: 'id', order: 'asc' }]);
const licenseList = ref([]);
const password = ref('');
const showMsgDialog = ref(false);
const msgDialogText = ref('');
const showNewDialog = ref(false);
const newLicenseDict = ref({
  batchSize:0,
  groupName:"",
  comment:"",
})

function pullLicense(){
  const licenseUrl = process.env.VUE_API_URL + '/license?password=' + password.value;
  fetch(licenseUrl,)
    .then(res => {
      return res.json();
    }).then(data => {
      if (data.ok == 1){
        licenseList.value = data.data.license_list;
      }else{
        msgDialogText.value = data.msg;
        showMsgDialog.value = true;
      }
    });
}

function newLicense(){
  showNewDialog.value = false;
  const licenseUrl = process.env.VUE_API_URL +
    '/new?password=' + password.value +
    '&batch_size=' + newLicenseDict.value.batchSize +
    '&group_name=' + newLicenseDict.value.groupName +
    '&comment=' + newLicenseDict.value.comment;
  fetch(licenseUrl)
    .then(res => {
      return res.json();
    }).then(data => {
      msgDialogText.value = data.msg;
      showMsgDialog.value = true;
    });
}
function modifyLicense(){
}
function deleteLicense(){
}

function exportLicense(){
}

const headers = [
  { title: 'ID', key: 'id', align: 'start', sortable: false,},
  { title: 'Group', key: 'group' },
  { title: 'Comment', key: 'comment' },
  { title: 'Edition', key: 'edition',minWidth:'200px'},
  { title: 'UUID',key: 'uuid',},
  { title: 'Is_Activated', key: 'is_activated' },
  { title: 'Last_Active_Time', key: 'last_active_time' },
  { title: 'Sequence', key: 'sequence', sortable: false },
  { title: 'License', key: 'license', sortable: false },
]

</script>
