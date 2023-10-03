import { defineStore } from "pinia";
import { db } from "../firebaseInit.js";

import axios from "axios";

export const useMainStore = defineStore("main", {
  state: () => ({
    /* User */
    userName: null,
    userEmail: null,
    userToken: null,
    userAvatar: null,
    main: {
      userEngagement: {
        totalInteractions: { daily: "1234", average: "1233" },
        averageMessagesPerChat: 10,
        averageChatsPerUser: 5,
        totalConversationDuration: "15:30:00",
      },
      userSatisfaction: {
        averageLikesPerChat: 3,
        averageDislikesPerChat: 1,
        likeDislikeRatio: 3,
      },
      usage: {
        totalUsers: 567,
        activeUsers: {
          daily: [10, 20, 30],
          weekly: [100, 200, 300],
          monthly: [800, 900, 1000],
        },
        commonUserQueries: [
          "How to reset password",
          "Product availability",
          "Pricing information",
        ],
      },
      performance: {
        averageResponseTime: "00:00:02",
        errorRate: 0.03,
      },
      conversion: {
        conversionRate: 0.12,
        revenueGenerated: 5000,
      },
      userDemographics: {
        userLocation: {
          usa: 60,
          europe: 25,
          asia: 15,
        },
        userDevices: {
          mobile: 45,
          desktop: 55,
        },
      },
      trafficSources: {
        sources: {
          website: 70,
          mobileApp: 20,
          socialMedia: 10,
        },
        referralSources: {
          direct: 50,
          search: 30,
          social: 20,
        },
      },
      botPerformance: {
        intentsRecognitionAccuracy: 0.92,
        entityRecognitionAccuracy: 0.85,
        conversationFlowAnalysis: {
          step1: 1000,
          step2: 800,
          step3: 600,
          step4: 400,
        },
      },
      securityAndCompliance: {
        numberOfSecurityIncidents: 2,
        complianceStatus: "Compliant",
      },
    },

    users: [
      {
        chat_ids: [],
        country: "",
        device_type: "",
        email: "",
        user: "loading...",
      }
    ],
    previewTimestamp: "Weekly",

    deviceType: null,
  }),
  actions: {
    setUser(payload) {
      if (payload.name) {
        this.userName = payload.name;
      }
      if (payload.email) {
        this.userEmail = payload.email;
      }
      if (payload.avatar) {
        this.userAvatar = payload.avatar;
      }
      if (payload.token) {
        this.userToken = payload.token;
      }
    },
    fetch(sampleDataKey) {
      axios
        .get(`/data-sources/${sampleDataKey}.json`)
        .then((r) => {
          if (r.data && r.data.data) {
            this[sampleDataKey] = r.data.data;
          }
        })
        .catch((error) => {
          alert(error.message);
        });
    },
    async getTotalUsers () {
      const query = db.collection('users');
      try {

        const snapshot = await query.get();
        const count = snapshot.size;
        console.log(count)
        this.main.usage.totalUsers = count;
      }
      catch (err) {
        console.log(err)
      }
    },
    getCurrentTimestamp() {
      const now = new Date();
      const seconds = Math.floor(now.getTime() / 1000);
      return { seconds: seconds, nanoseconds: 0 };
    },
    
    async getTodaysUsers() {
      const query = db.collection('users');
      const today = this.getCurrentTimestamp();
      
      try {
        const snapshot = await query.where('registration_date', '>', today).get();
        const count = snapshot.size;
        console.log(count)
        this.main.totalInteractions.daily = count;
        
      }
      catch (err) {
        console.log(err)
      }
    },    
    setDeviceType() {
      const platform = navigator.platform.toLowerCase();
      if (
        /(android|webos|iphone|ipad|ipod|blackberry|windows phone)/.test(
          platform
        )
      ) {
        this.deviceType = "mobile";
      } else if (/mac|win|linux/i.test(platform)) {
        this.deviceType = "desktop";
      } else if (/tablet|ipad/i.test(platform)) {
        this.deviceType = "tablet";
      } else {
        this.deviceType = "unknown";
      }
    },
  },
});
