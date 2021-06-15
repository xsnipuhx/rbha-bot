import { MessageHandler, MessageEmbed } from '@sjbha/app';
import { DateTime, Interval } from 'luxon';
import * as R from 'ramda';

import { Workouts, sumExp, Workout } from '../db/workout';
import { DisplayNames } from '../common/DisplayNames';

export const leaders : MessageHandler = async message => {
  const lastThirtyDays = Interval.before (DateTime.local (), { days: 30 });
  const allWorkouts = await Workouts ()
    .during (lastThirtyDays)
    .find ()
    .then (WorkoutCollection);

  const nicknames = await DisplayNames.fetch (allWorkouts.discordIds);
  nicknames.defaultName = '(Missing)';

  const embed = new MessageEmbed ({
    color:       0xffffff,
    title:       'Leaders',
    description: 'Top EXP Earners in the last 30 days, per activity',
    footer:      {
      text: '*Only HR activities are considered for leaders'
    }
  });

  for (const activity of allWorkouts.activityTypes) {
    const workouts = allWorkouts.filterType (activity);

    // list of people who have actually recorded an activity of this type
    const leaderboard = workouts.discordIds
      .map (discordId => ({ 
        nickname: nicknames.get (discordId), 
        workouts: workouts.filterUser (discordId) 
      }))
      .sort ((a, b) => a.workouts.exp > b.workouts.exp ? -1 : 1);

    const [first, second] = leaderboard;

    let leaders = `🏆 ${first.nickname} • **${first.workouts.exp.toFixed (1)}** exp (${first.workouts.count} workouts)`;

    if (second) {
      leaders += `\n🥈 ${second.nickname} • **${second.workouts.exp.toFixed (1)}** exp (${second.workouts.count} workouts)`;
    }

    embed.addField (activity, leaders);
  }

  message.channel.send (embed);
}

const WorkoutCollection = (workouts: Workout.Model[]) => ({
  discordIds:    R.uniq (workouts.map (w => w.discord_id)),
  activityTypes: R.uniq (workouts.map (w => w.activity_type)),
  count:         workouts.length,
  exp:           sumExp (workouts),

  filterType: (activityType: string) => WorkoutCollection (
    workouts.filter (w => w.activity_type === activityType)
  ),

  filterUser: (discordId: string) => WorkoutCollection (
    workouts.filter (w => w.discord_id === discordId)
  )
});