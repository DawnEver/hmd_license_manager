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
      @click="showModifyDialog = true"
    >
      {{ $t("modify") }}
    </v-btn>
    <!-- reset -->
    <v-btn
      variant="plain"
      prepend-icon="mdi-refresh"
      @click="resetLicense"
    >
      {{ $t("reset") }}
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
    v-model="selectedLicenses"
    :headers="headers"
    :items="gotLicenses"
    :search="search"
    :sort-by="sortBy"
    items-per-page="5"
    return-object
    show-select
    hover
  ></v-data-table>
  <!-- <pre>{{selectedLicenses}}</pre> -->

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
  <!-- modify dialog -->
  <v-dialog
      v-model="showModifyDialog"
      min-width="400px"
    >
      <v-card
        prepend-icon="mdi-pencil"
        title="MODIFY"
      >
        <v-text-field
          min=0
          label="Group Name"
          v-model="modifyDict.groupName"
        ></v-text-field>
        <v-text-field
          min=0
          label="Comment"
          v-model="modifyDict.comment"
        ></v-text-field>
        <template v-slot:actions>
          <v-btn
            class="ms-auto"
            @click="deleteLicense"
            prepend-icon="mdi-delete"
          >
            {{ $t("delete") }}
          </v-btn>
          <v-spacer></v-spacer>
          <v-btn
            class="ms-auto"
            @click="showModifyDialog = false"
            prepend-icon="mdi-close-thick"
          >
            {{ $t("cancel") }}
          </v-btn>
          <v-btn
            class="ms-auto"
            @click="modifyLicense"
            prepend-icon="mdi-pencil"
          >
            {{ $t("modify") }}
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


<script setup lang="ts">
import { ref } from 'vue'

const selectedLicenses = ref([]);
const search = ref('');
const sortBy:any = ref([{ key: 'id', order: 'asc' }]);
const gotLicenses = ref([]);
const password = ref('');
const showMsgDialog = ref(false);
const msgDialogText = ref('');
const showNewDialog = ref(false);
const newLicenseDict = ref({
  batchSize:0,
  groupName:"",
  comment:"",
})
const showModifyDialog = ref(false);
const modifyDict = ref({
  groupName:"",
  comment:"",
})

const headers:any = [
  { title: 'ID', key: '_id', align: 'start', sortable: false,},
  { title: 'Group', key: 'group' },
  { title: 'Comment', key: 'comment' },
  { title: 'Edition', key: 'edition',minWidth:'200px'},
  { title: 'UUID',key: 'uuid',},
  { title: 'Is_Activated', key: 'is_activated' },
  { title: 'Last_Active_Time', key: 'last_active_time' },
  { title: 'Sequence', key: 'sequence', sortable: false },
  { title: 'License', key: 'license', sortable: false },
]

interface License {
  sequence_hash: string;
  sequence: string;
}

function pullLicense(){
  const url = process.env.VUE_API_URL + '/license?password=' + password.value;
  fetch(url)
    .then(res => {
      return res.json();
    }).then(data => {
      if (data.ok == 1){
        gotLicenses.value = data.data.license_list;
      }else{
        msgDialogText.value = data.msg;
        showMsgDialog.value = true;
      }
    });
}

function newLicense(){
  showNewDialog.value = false;
  const url = process.env.VUE_API_URL +
    '/new?password=' + password.value +
    '&batch_size=' + newLicenseDict.value.batchSize +
    '&group_name=' + newLicenseDict.value.groupName +
    '&comment=' + newLicenseDict.value.comment;
  fetch(url)
    .then(res => {
      return res.json();
    }).then(data => {
      msgDialogText.value = data.msg;
      showMsgDialog.value = true;
    });
}
function modifyLicense(){
  showModifyDialog.value = false;
  const sequence_hashs = selectedLicenses.value.map(
    (item:License) => item.sequence_hash
  );
  const url = process.env.VUE_API_URL + '/modify?password=' + password.value +
    '&id=' + sequence_hashs.join('&id=') +
    '&group_name=' + modifyDict.value.groupName +
    '&comment=' + modifyDict.value.comment;
  fetch(url)
    .then(res => {
      return res.json();
    }).then(data => {
      msgDialogText.value = data.msg;
      showMsgDialog.value = true;
    });
}
function deleteLicense(){
  const sequence_hashs = selectedLicenses.value.map(
    (item:License) => item.sequence_hash
  );
  const url = process.env.VUE_API_URL + '/delete?password=' + password.value
    + '&id=' + sequence_hashs.join('&id=');
  fetch(url)
    .then(res => {
      return res.json();
    }).then(data => {
      showModifyDialog.value = false;
      msgDialogText.value = data.msg;
      showMsgDialog.value = true;
    });
}

function resetLicense(){
  const sequence_hashs = selectedLicenses.value.map(
    (item:License) => item.sequence_hash
  );
  const url = process.env.VUE_API_URL + '/reset?password=' + password.value
    + '&id=' + sequence_hashs.join('&id=');
  fetch(url)
    .then(res => {
      return res.json();
    }).then(data => {
      msgDialogText.value = data.msg;
      showMsgDialog.value = true;
    });
}


function exportLicense(){
  const sequences = selectedLicenses.value.map(
    // remove -----BEGIN PUBLIC KEY-----\n \n-----END PUBLIC KEY-----
    (item:License) => item.sequence.slice(27,-25).replace('\n', '\\n')
  );
  msgDialogText.value = sequences.join('\n');
  showMsgDialog.value = true;
}


</script>
