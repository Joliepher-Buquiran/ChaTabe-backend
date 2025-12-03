
import User from '../../model/userModel.js';
import Message from '../../model/messageModel.js';

export const getStatsByRange = async (req, res) => {
  try {
    const { range = '7d' } = req.query; 

    let startDate, groupBy, dateFormat;

    const now = new Date();
    const endDate = new Date(now.setHours(23, 59, 59, 999));

    if (range === '1d') {

        startDate = new Date(now.setHours(0, 0, 0, 0));
        groupBy = { $hour: '$createdAt' };
        dateFormat = (d) => `${d.getHours()}:00`;

    } else if (range === '7d') {

        startDate = new Date(Date.now() - 6 * 24 * 60 * 60 * 1000);
        startDate.setHours(0, 0, 0, 0);
        groupBy = { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } };
        dateFormat = (d) => new Date(d).toLocaleDateString('en', { weekday: 'short' });

    } else if (range === '30d') {

        startDate = new Date(Date.now() - 29 * 24 * 60 * 60 * 1000);
        startDate.setHours(0, 0, 0, 0);
        groupBy = { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } };
        dateFormat = (d) => new Date(d).toLocaleDateString('en', { month: 'short', day: 'numeric' });

    } else if (range === '1y') {

            startDate = new Date(Date.now() - 365 * 24 * 60 * 60 * 1000);
            startDate.setHours(0, 0, 0, 0);
            groupBy = { $dateToString: { format: '%Y-%m', date: '$createdAt' } };
            dateFormat = (d) => new Date(d + '-01').toLocaleDateString('en', { month: 'short', year: '2-digit' });

    } else {

        return res.status(400).json({ success: false, message: 'Invalid range' });

    }

    const userPipeline = [
      { $match: { createdAt: { $gte: startDate }, isAdmin: { $ne: true } } },
      { $group: { _id: groupBy, count: { $sum: 1 } } },
      { $sort: { _id: 1 } }
    ];

    const messagePipeline = [
      { $match: { createdAt: { $gte: startDate } } },
      { $group: { _id: groupBy, count: { $sum: 1 } } },
      { $sort: { _id: 1 } }
    ];

    const [userStats, messageStats] = await Promise.all([
      User.aggregate(userPipeline),
      Message.aggregate(messagePipeline)
    ]);

    
    const allDates = new Set([...userStats.map(u => u._id), ...messageStats.map(m => m._id)]);

    const data = Array.from(allDates).sort().map(date => ({

      date: typeof date === 'number' ? dateFormat(new Date(startDate).setHours(date)) : dateFormat(date),
      newUsers: userStats.find(user => user._id === date)?.count || 0,
      messages: messageStats.find(message => message._id === date)?.count || 0

    }));

    res.json({ success: true, data, range });

  } catch (error) {

    console.error("Stats error:", error);
    res.status(500).json({ success: false });
  
}
};