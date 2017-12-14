import Vue from 'vue';
import moment from 'moment';
import { Component } from 'vue-property-decorator';
import { Inject } from '../../util/injector';
import ModalLayout from '../ModalLayout.vue';
import windowMixin from '../mixins/window';
import { INotification, INotificationsApi } from 'services/notifications';

@Component({
  components: { ModalLayout },
  mixins: [windowMixin]
})
export default class Notifications extends Vue {

  @Inject() private notificationsService: INotificationsApi;

  private updateInterval = 0;


  mounted() {
    // update the time labels
    this.updateInterval = window.setInterval(() => {
      this.$forceUpdate();
    }, 60 * 1000);
  }


  destroyed() {
    this.notificationsService.markAllAsRead();
    clearInterval(this.updateInterval);
  }


  get notificationGroups(): { unread: INotification[], read: INotification[] } {
    return {
      unread: this.notificationsService.getUnread(),
      read: this.notificationsService.getRead()
    };
  }

  get notificationsCount() {
    return this.notificationsService.getAll().length;
  }


  onNotificationClickHandler(id: number) {
    this.notificationsService.applyAction(id);
  }


  moment(time: number): string {
    return moment(time).fromNow();
  }
}