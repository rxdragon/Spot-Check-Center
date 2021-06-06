<template>
  <div class="divide-y divide-gray-200">
    <div
      v-for="(item,index) in gradeBoxData"
      :key="item.id"
      class="grade-box mb-6"
      :class="{'pt-6':index != 0}"
    >
      <!-- 列表 -->
      
      <!-- 照片信息 -->
      <div class="photo-panel mb-6">
        <div class="panel-title">
          <span>照片评分</span>
        </div>
        <div class="panel-content">
          <div class="photo-list grade-photo-list">
            <div v-for="(photoItem, photoIndex) in item.photoList" :key="photoItem.id" class="photo-box">
              <PhotoBox
                :src="photoItem.path"
                version=""
                class="mr-4"
                @click="onSelectPhoto(photoIndex)"
              >
                <template #otherInfo>
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
                </template>
              </PhotoBox>
            </div>
          </div>
        </div>
      </div>
      <!-- 订单信息 -->
      <div class="order-panel panel-info mb-6">
        <div class="panel-title">订单信息</div>
        <div class="panel-content">
          <div class="base-info panel-row">
            <span class="order-info w-44"><span class="order-info-title">流水号：</span>{{ item.orderMsg.id }}</span>
            <span class="order-info w-44"><span class="order-info-title">产品名称：</span>{{ item.orderMsg.productName }}</span>
            <span class="order-info w-44"><span class="order-info-title">照片张数：</span>{{ item.orderMsg.photoNum }}</span>
            <span class="order-info w-44">
              <span class="order-info-title">门店类型：</span>{{ item.storeType }}
              <div class="standard-icon" />
            </span>
            <span class="order-info w-40"><span class="order-info-title">门店：</span>{{ item.orderMsg.storeName }}</span>
          </div>
          <div class="base-info panel-row">
            <span class="order-info w-44"><span class="order-info-title">化妆师：</span>{{ item.orderMsg.dresserLow }}</span>
            <span class="order-info w-44"><span class="order-info-title">化妆督导：</span>{{ item.orderMsg.dresserMiddel }}</span>
            <span class="order-info w-44"><span class="order-info-title">化妆专家：</span>{{ item.orderMsg.dresserTop }}</span>
          </div>
          <div class="base-info panel-row">
            <span class="order-info"><span class="order-info-title">订单备注：</span>{{ item.orderMsg.orderRemarks }}</span>
          </div>
          <div class="base-info panel-row">
            <span class="order-info"><span class="order-info-title">摄影备注：</span>{{ item.orderMsg.filmRemarks }}</span>
          </div>
          <div class="base-info panel-row">
            <span class="order-info"><span class="order-info-title">化妆备注：</span>{{ item.orderMsg.dressRemarks }}</span>
          </div>
        </div>
      </div>
    
    
      <!-- 评价信息 -->
      <div class="panel-info mb-6">
        <div class="panel-title">
          <span>评价信息</span>
          <div class="score-box">
            <el-button size="mini" type="primary">
              修改评分
            </el-button>

            <el-button size="mini" type="primary">
              我要申诉
            </el-button>
          </div>
        </div>
        <div class="panel-content">
          <div class="grade-score panel-row">
            <span class="order-info"><span class="order-info-title">总分：</span>{{ item.evalute.totalScore }}</span>
            <span class="order-info"><span class="order-info-title">评分人：</span>{{ item.evalute.scoringPerson }}</span>
          </div>
          <div class="issue-class-box panel-row">
            <!-- <el-tag
              v-for="(item, index) in 5"
              :key="index"
              :class="['type-tag', item.type]"
              size="medium"
            >
              {{ '大联赛冠军' }}
            </el-tag> -->
          </div>
        </div>
      </div>
    </div>
    <AppealPop />
  </div>
</template>

<script lang="ts">
import { defineComponent, inject, ref } from 'vue'
import PhotoBox from '@/components/PhotoBox/index.vue'
import { SPOT_TYPE } from '@/model/SpotCheckRecordModel'

export default defineComponent({
  name: 'GradeBox',
  components: { PhotoBox },
  inject: ['cloudType'],
  props: {
    photoInfo: { type: Object, default: () => ({}) } // 照片数据
  },
  data () {
    return {
      SPOT_TYPE
    }
  },
  setup () {
    const routeName = ref('') /* 路由名字 */
    const gradeInfo = ref('')
    const showGradePreview = ref('') /* 是否显示大概概览 */
    const showPhotoVersion = ref('') /* 展示图片版本 */
    const type = ref('')
    const gradeBoxData: any = inject('gradeBoxData')

    const onSelectPhoto = (photoIndex: string | number | symbol) => {
      return photoIndex
    }

    return {
      routeName,
      gradeInfo,
      showGradePreview,
      showPhotoVersion,
      type,
      gradeBoxData,
      onSelectPhoto
    }
  },
  computed: {
    photoInfoData () {
      return this.photoInfo
    },
    photoVersionList () {
      const photoVersionInfo = this.photoInfo.photoInfo.photoSpotCheckVersion
      photoVersionInfo.forEach((versionItem: any) => {
        versionItem.phototag = this.photoInfo.photoData.tags
      })
      return photoVersionInfo
    }
  },
  methods: {

  }
})
</script>

<style lang="less">

.grade-box {
  .grid-list {
    display: flex;
    margin-bottom: 50px;
  }

  .photo-panel {
    flex-shrink: 0;
    width: 542px;

    .panel-title {
      display: flex;
      align-items: center;
      margin-bottom: 20px;

      .score-box {
        margin-left: auto;

        .el-button {
          margin-right: 12px;
        }
      }

      .grade-again-tag {
        margin-left: 12px;
      }
    }

    .photo-list {
      display: flex;
      align-items: center;
      justify-content: flex-start;
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

  .order-panel {
    width: 100%;
  }

  .panel-info {
    .panel-title {
      display: flex;
      justify-content: space-between;
      margin-bottom: 20px;
    }

    .panel-content {
      height: calc(100% - 44px);
      padding: 0 20px;
      background-color: #fafafa;
      border-radius: 4px;

      .grade-score {
        .order-info {
          margin-right: 54px;
          font-weight: 600;
          color: #303133;
        }
      }

      .issue-class-box {
        display: flex;
        flex-wrap: wrap;

        .label-title {
          flex-shrink: 0;
          margin: 0 20px 0 0;
          font-size: 14px;
          font-weight: 600;
          line-height: 28px;
          color: #303133;
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

        .label-box {
          margin-bottom: -10px;

          .el-tag {
            margin: 0 10px 10px 0;
            font-size: 12px;
            font-weight: 400;
            border-radius: 4px;
          }
        }
      }

      .base-info {
        .order-info {
          display: inline-block;
          margin-right: 32px;
        }
      }

      .reference-photo {
        & .el-image {
          width: 60px;
          height: 60px;
        }

        .impression-name {
          display: inline-block;
          margin-right: 12px;
        }
      }

      .panel-row {
        display: flex;
        align-items: center;
        min-height: 60px;
        font-size: 14px;
        line-height: 22px;
        color: #303133;
        border-bottom: 1px solid @borderColor;

        .order-info {
          .order-info-title {
            display: inline-block;
          }
        }

        &.reference-photo {
          height: 85px;
        }
      }

      .panel-row:nth-last-child(1) {
        border: none;
      }

      .retouch-require {
        border-bottom: 1px solid @borderColor;

        & > span {
          margin-right: 12px;
        }
      }

      .retouch-remark {
        .remark-title {
          width: 110px;
        }

        .remark-content {
          width: calc(100% - 70px);
          white-space: pre-line;

          .content-el-tag {
            margin-right: 10px;
          }
        }

        .retouch-notice {
          word-break: break-all;
        }
      }
    }
  }

  .audit-info {
    .audit-content {
      .radio-box {
        display: flex;
        align-items: center;

        .el-radio {
          margin-right: 20px;
        }

        .sameOpinion-item {
          margin-right: 40px;
        }
      }

      .correct-remark {
        padding-top: 20px;
      }
    }

    .issue-label {
      padding: 10px;

      .issue-content {
        .el-select {
          width: 100%;
        }
      }

      .issue-remark {
        margin-top: 10px;
      }
    }

    .audit-content-finish {
      padding: 20px;

      .audit-opinion {
        .audit-tag {
          margin-right: 21px;
        }
      }

      .audit-remark {
        margin-top: 10px;
        font-size: 14px;
        line-height: 22px;
        color: #303133;
      }
    }
  }

  .flakiness-info {
    .issue-label {
      padding-top: 20px;

      .issue-content {
        .issue-label-box {
          margin-bottom: 10px;
        }

        .el-select {
          width: 100%;
        }
      }
    }

    .panel-content {
      padding: 20px;
    }

    .flakiness-remark {
      margin-top: 10px;
      font-size: 14px;
      font-weight: 400;
      line-height: 22px;
      color: #303133;
    }
  }

  .button-box {
    margin-top: 20px;
    text-align: left;
  }
}
</style>
