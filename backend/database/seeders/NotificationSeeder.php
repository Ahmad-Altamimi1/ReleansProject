<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Notification;

class NotificationSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run()
    {
        // Generate notifications for meetings
        $meetingNotifications = [
            [
                'userid' => 1,
                'message' => 'You have a meeting at 6 am',
            ],
            [
                'userid' => 2,
                'message' => 'Reminder: Meeting with client at 12 am',
            ],
            [
                'userid' => 1,
                'message' => 'Reminder: Meeting with client at 10 am',
            ],

        ];

        $productNotifications = [
            [
                'userid' => 1,
                'productId' => 1,
                'message' => 'The price of Product Banan has changed to $12.99',
            ],
            [
                'userid' => 2,
                'productId' => 2,
                'message' => 'Product SMS is now on sale for $0.20',
            ],
            [
                'userid' => 1,
                'productId' => 1,
                'message' => 'The price of Product Banan has changed to $12.99',
            ],
            [
                'userid' => 2,
                'productId' => 2,
                'message' => 'Product SMS is now on sale for $0.20',
            ],
        ];

        $allNotifications = array_merge($meetingNotifications, $productNotifications);

        foreach ($allNotifications as $notification) {
            Notification::create($notification);
        }
    }
}
