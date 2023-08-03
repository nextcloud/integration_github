<?php

namespace OCA\Github\Listener;

use OCA\Github\AppInfo\Application;
use OCA\TPAssistant\Event\BeforeAssistantNotificationEvent;
use OCP\EventDispatcher\Event;
use OCP\EventDispatcher\IEventListener;

class AssistantListener implements IEventListener {
	public function handle(Event $event): void {
		if (!$event instanceof BeforeAssistantNotificationEvent) {
			return;
		}

		if ($event->getTask()->getAppId() === Application::APP_ID) {
			$event->setWantsNotification(true);
			$event->setNotificationTarget('https://free.fr/githubbbbbbbb');
		}
	}
}
