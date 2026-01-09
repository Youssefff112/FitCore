import { WorkoutPlan } from '../Workout/workout.model.js';
import { User } from '../User/user.model.js';
import { sendWorkoutReminderEmail } from '../../Utils/Emails/sendEmail.utils.js';

export const notificationService = {
  // Send workout reminders (FR-3.4)
  async sendWorkoutReminders() {
    const today = new Date().toLocaleDateString('en-US', { weekday: 'lowercase' });
    
    // Find all active workout plans for today
    const plans = await WorkoutPlan.find({
      isActive: true,
      'weeklySchedule.day': today
    }).populate('user');

    let sentCount = 0;
    for (const plan of plans) {
      const todayWorkout = plan.weeklySchedule.find(d => d.day === today && !d.isRestDay);
      
      if (todayWorkout && plan.user && plan.user.userType === 'offline') {
        try {
          await sendWorkoutReminderEmail(plan.user, todayWorkout);
          sentCount++;
        } catch (error) {
          console.error(`Failed to send reminder to ${plan.user.email}:`, error);
        }
      }
    }

    return { message: `Sent ${sentCount} workout reminders` };
  }
};