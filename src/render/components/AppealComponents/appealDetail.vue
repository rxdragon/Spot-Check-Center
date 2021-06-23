<template>
  <div class="appeal-detail">
    <div class="module-panel mb-6">
      <div class="panel-title mb-6">订单信息</div>
      <div class="panel-content mb-6">
        <el-table
          border
          stripe
          :data="orderTableData"
          style="width: 100%;"
        >
          <el-table-column align="center" prop="num" label="订单号" />
          <el-table-column align="center" prop="productName" label="产品名称" />
          <el-table-column align="center" prop="storeName" label="所属门店" />
          <el-table-column align="center" :label="type === SPOT_TYPE.MAKEUP ? '化妆师' : '摄影师'">
            <template #default="{ row }">
              <span v-if="type === SPOT_TYPE.MAKEUP">{{ row.dresser }}</span>
              <span v-if="type === SPOT_TYPE.PHOTOGRAPHY">{{ row.photographer }}</span>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            :label="type === SPOT_TYPE.MAKEUP ? '化妆督导' : '摄影督导'"
          >
            <template #default="{ row }">
              <span v-if="type === SPOT_TYPE.MAKEUP">{{ row.dresserSupervisor }}</span>
              <span v-if="type === SPOT_TYPE.PHOTOGRAPHY">{{ row.photographerSupervisor }}</span>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            :label="type === SPOT_TYPE.MAKEUP ? '化妆专家' : '摄影专家'"
          >
            <template #default="{ row }">
              <span v-if="type === SPOT_TYPE.MAKEUP">{{ row.dresserExperts }}</span>
              <span v-if="type === SPOT_TYPE.PHOTOGRAPHY">{{ row.photographerExperts }}</span>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="panel-title mb-6">申诉信息</div>
      <div class="grid mb-6">
        <div>
          申诉标签：<el-tag
            v-for="(tagItem) in tagsList"
            :key="tagItem.id"
            :class="['type-tag', tagItem.type]"
            size="medium"
          >
            {{ tagItem.name }}
          </el-tag>
        </div>
      </div>
      <div class="flex items-start mb-6">
        <span class="flex-none">申诉原因：</span>
        <span>{{ appealNote }}</span>
      </div>
      <div class="flex items-center mb-6">
        <span class="mr-10">处理状态：{{ statusCN }}</span>
        <span class="mr-10">初审人：{{ firstExamineInfo.examineName }}</span>
        <span class="mr-10">初审时间：{{ firstExamineInfo.date }}</span>
        <span class="mr-10">复审人 {{ secondExamineInfo.examineName }}</span>
        <span>复审时间：{{ secondExamineInfo.date }}</span>
      </div>
      <div class="flex items-start">
        <span class="flex-none">拒绝原因：</span>
        <span>{{ rejectedNote }}</span>
      </div>
    </div>
    <div class="module-panel mb-6">
      <div class="panel-title mb-6">照片信息</div>
      <div class="photo-list grade-photo-list overflow-x-auto overscroll-x-contain">
        <div v-for="(photoItem, photoIndex) in photoList" :key="photoItem.id" class="photo-box">
          <PhotoBox
            :src="photoItem.path"
            version=""
            class="mr-4"
            @click="onSelectPhoto(photoIndex)"
          >
            <!-- <template #otherInfo>
              <div class="audio-ino">
                AI审核结果：
                <span
                  v-if="type === SPOT_TYPE.MAKEUP"

                  :class="photoItem.makeupDegreeType === 'normal' ? 'text-blue-600' : 'text-red-500'"
                >
                  {{ photoItem.makeupDegree }}
                </span>
                <span
                  v-if="type === SPOT_TYPE.PHOTOGRAPHY"
                  :class="photoItem.photographyDegreeType === 'normal' ? 'text-blue-600' : 'text-red-500'"
                >
                  {{ photoItem.photographyDegree }}
                </span>
              </div>
            </template> -->
          </PhotoBox>
        </div>
      </div>
    </div>
    <div v-if="isHistory === 'false'" class="text-center mb-6">
      <el-button class="mr-14" type="danger" @click="dialogVisible = true">
        审核拒绝
      </el-button>
      <el-button type="primary" @click="submitPass">
        审核通过
      </el-button>
    </div>
    <PreviewPhoto
      v-if="showPreview"
      v-model:showPreview="showPreview"
      :imgarray="previewPhoto"
      :index="previewIndex"
    />
    <el-dialog
      v-model="dialogVisible"
      title="审核拒绝原因"
      width="500px"
      :show-close="false"
      :center="true"
    >
      <el-input
        v-model="refuseResult"
        type="textarea"
        placeholder="最多200个字符"
        maxlength="200"
        show-word-limit
        rows="4"
        resize="none"
      />
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="submitRefuse">确 定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { defineComponent, inject, reactive, ref, Ref } from 'vue'
import PhotoBox from '@/components/PhotoBox/index.vue'
import * as AppealApi from '@/api/appealApi'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from '@/store/index'
import { ORGANIZATION_TYPE, SPOT_TYPE } from '@/model/Enumerate'
import { IAppealOrder } from '@/model/AppealDetailModel'
import { newMessage } from '@/utils/message'
import PreviewPhoto from '@/components/PreviewPhoto/index.vue'
import { APPEAL_STATUS } from '@/model/AppealModel'
import PoolPhotoModel from '~/render/model/PoolPhotoModel'

export default defineComponent({
  name: 'AppealDetail',
  components: {
    PhotoBox,
    PreviewPhoto
  },
  setup () {
    const route = useRoute()
    const router = useRouter()
    const store = useStore()
    const type = _.get(route,'query.type') || ''
    const isHistory = _.get(route,'query.isHistory') || 'false'
    const organizationType = inject('organizationType', ORGANIZATION_TYPE.HIMO)

    /**
     * @description 审核弹窗相关
    */
    const dialogVisible = ref(false)
    const refuseResult = ref('')

    /** 监听预览图片 */
    const showPreview = ref(false)
    const previewIndex = ref(0)
    const previewPhoto = ref([])
    let orderInfo = {}

    const onPreviewPhotoList = ({ photoIndex, photoData }: { photoIndex: number, photoData: any }) => {
      previewPhoto.value = photoData
      previewIndex.value = photoIndex
      showPreview.value = true
    }

    /** 获取初审申诉绩效 */
    const status = ref('')
    const statusCN = ref('')
    const rejectedNote = ref('')
    const tagsList = ref<any[] | undefined>([])
    const orderTableData = ref<IAppealOrder[]>([])
    const photoList: Ref<PoolPhotoModel[]> = ref([])
    const firstExamineInfo = reactive({
      date: '',
      examineName: ''
    })
    const secondExamineInfo = reactive({
      date: '',
      examineName: ''
    })
    const appealNote = ref('')
    const getDetail = async () => {
      const req = {
        id: _.get(route,'query.id') || ''
      }
      const res = await AppealApi.getAppealDetail(req, organizationType)
      status.value = res.status
      statusCN.value = res.statusCN
      orderTableData.value = res.orderInfo
      photoList.value = res.photoList
      firstExamineInfo.date = _.get(res, 'firstExamineInfo.date')
      firstExamineInfo.examineName = _.get(res, 'firstExamineInfo.examineName')
      secondExamineInfo.date = _.get(res, 'secondExamineInfo.date')
      secondExamineInfo.examineName = _.get(res, 'secondExamineInfo.examineName')
      appealNote.value = _.get(res, 'appealNote')
      tagsList.value = _.get(res, 'tagsList')
      orderInfo = { ..._.get(res, 'streamInfo') }
    }
    getDetail()

    /** 初审审核 */
    const examineFirst = async (result: string) => {
      const req: AppealApi.IExamineParams = {
        id: _.get(route,'query.id') || '',
        result: result
      }
      if (refuseResult.value) req.note = refuseResult.value
      if (result === 'refusal' && !refuseResult.value) {
        newMessage.warning('请填写拒绝原因。')
        return
      }
      try {
        store.dispatch('settingStore/showLoading', route.name)
        await AppealApi.examineFirst(req, organizationType)
        newMessage.success('提交成功')
        dialogVisible.value = false
        router.back()
      } finally {
        store.dispatch('settingStore/hiddenLoading', route.name)
      }
    }

    /** 复审审核 */
    const examineSecond = async (result: string) => {
      const req: AppealApi.IExamineParams = {
        id: _.get(route,'query.id') || '',
        result: result,
      }
      if (refuseResult.value) req.note = refuseResult.value
      if (result === 'refusal' && !refuseResult.value) {
        newMessage.warning('请填写拒绝原因。')
        return
      }
      try {
        store.dispatch('settingStore/showLoading', route.name)
        await AppealApi.examineSecond(req, organizationType)
        newMessage.success('提交成功')
        dialogVisible.value = false
        router.back()
      } finally {
        store.dispatch('settingStore/hiddenLoading', route.name)
      }
    }

    const checkStatus = () => {
      if ( status.value === APPEAL_STATUS.WAIT_FIRST_APPEAL || status.value === APPEAL_STATUS.FIRST_APPEAL) return 'first'
      if ( status.value === APPEAL_STATUS.WAIT_SECOND_APPEAL || status.value === APPEAL_STATUS.SECOND_APPEAL) return 'second'
    }

    const onSelectPhoto = (photoIndex: number) => {
      const photos = photoList.value || []
      const photoData = photos.map((photoItem: any, index: number) => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        return {
          title: `第${index + 1}张图`,
          ...photoItem,
          orderInfo
        }
      })
      
      const data = {
        photoData,
        photoIndex
      }
      onPreviewPhotoList(data)
    }

    const submitRefuse = async () => {
      if ( checkStatus() === 'first') {
        examineFirst('refusal')
      } else {
        examineSecond('refusal')
      }
    }

    const submitPass = async () => {
      if ( checkStatus() === 'first') {
        examineFirst('pass')
      } else {
        examineSecond('pass')
      }
    }

    return {
      type,
      isHistory,
      organizationType,
      orderTableData,
      photoList,
      firstExamineInfo,
      secondExamineInfo,
      appealNote,
      showPreview,
      previewIndex,
      previewPhoto,
      dialogVisible,
      refuseResult,
      status,
      statusCN,
      rejectedNote,
      tagsList,
      onSelectPhoto,
      submitRefuse,
      submitPass,
      SPOT_TYPE
    }
  }
})
</script>

<style lang="less" scoped>
.module-panel {
  font-size: 14px;
  color: #303133;

  .photo-list {
    display: flex;
    align-items: center;
    justify-content: flex-start;
  }

  .type-tag {
    margin-right: 10px;
    margin-bottom: 10px;

    &.plant {
      color: #38bc7f;
      background-color: #ecf7f2;
      border-color: #7fd9af;
    }

    &.pull {
      color: #ff3974;
      background-color: #fff0f0;
      border-color: #f99ab7;
    }

    &.middle,
    &.small {
      color: #ff8f00;
      background-color: #fff7ed;
      border-color: #ffce90;
    }
  }

  .photo-box {
    width: 253px;
    margin-right: 24px;
    margin-bottom: 0;
  }

  .photo-main {
    display: flex;
  }
}
</style>
