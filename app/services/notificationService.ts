import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { getTotals, getTargets } from './energyService'; // ฟังก์ชันจำลองดึง totals, targets

export async function registerForPushNotifications() {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
    }

    if (finalStatus !== 'granted') {
        console.log('Notification permission not granted!');
        return false;
    }
    return true;
}

// ฟังก์ชัน schedule notification รายวัน
export async function scheduleDailyNotifications() {
    await Notifications.cancelAllScheduledNotificationsAsync(); // เคลียร์ก่อน

    // ตัวอย่างเวลาตามวัน
    const times = [
        { hour: 8, minute: 0, type: 'morning', title: 'Good morning! 🌞', body: "Time for breakfast! Don't forget to log your meal." },
        { hour: 12, minute: 0, type: 'lunch', title: 'Lunch time! 🍽️', body: "Don't forget to log your lunch!" },
        { hour: 18, minute: 0, type: 'dinner', title: 'Dinner time 🌇', body: "Remember to log your dinner." },
        { hour: 21, minute: 30, type: 'summary', title: 'Daily Summary 📊', body: "Check your daily progress and goals before bed." },
    ];

    for (const t of times) {
        await Notifications.scheduleNotificationAsync({
            content: {
                title: t.title,
                body: t.type === 'summary'
                    ? 'Check your daily summary at 21:30 📊'
                    : "Don't forget to log your meals today! 🍽️",
                sound: 'default',
            },
            trigger: {
                type: 'calendar',
                hour: t.hour,
                minute: t.minute,
                second: 0,
                repeats: true,
            } as Notifications.CalendarTriggerInput,
        });
    }
}

export async function notifyAfterLogging() {
    console.log('notifyAfterLogging เรียกแล้ว');

    try {
        // ดึงข้อมูลยอดรวมปัจจุบัน
        const totals = await getTotals(); // { calories, protein, fat, carbs }
        const targets = await getTargets(); // { caloriesGoal, proteinGoal, fatGoal, carbsGoal }

        // คำนวณว่าเหลือหรือเกิน
        const remainCalories = targets.caloriesGoal - totals.calories;
        const remainProtein = targets.proteinGoal - totals.protein;
        const remainCarbs = targets.carbsGoal - totals.carbs;
        const remainFat = targets.fatGoal - totals.fat;

        // สร้างข้อความสรุป
        const body = `
🔹 Calories: ${remainCalories >= 0 ? `เหลือ ${remainCalories}` : `เกิน ${-remainCalories}`} kcal
🔹 Protein: ${remainProtein >= 0 ? `เหลือ ${remainProtein}` : `เกิน ${-remainProtein}`} g
🔹 Carbs: ${remainCarbs >= 0 ? `เหลือ ${remainCarbs}` : `เกิน ${-remainCarbs}`} g
🔹 Fat: ${remainFat >= 0 ? `เหลือ ${remainFat}` : `เกิน ${-remainFat}`} g
    `;

        // ส่ง local notification
        await Notifications.scheduleNotificationAsync({
            content: {
                title: 'สรุปหลังบันทึกอาหารวันนี้ 🍽️',
                body: body.trim(),
                sound: 'default',
            },
            trigger: null, // null = ส่งทันที
        });

        console.log('Notification ถูก schedule เรียบร้อย');
    } catch (err) {
        console.error('Error notifyAfterLogging:', err);
    }
}
