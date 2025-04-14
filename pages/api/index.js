import ConnectDb from "@/lib/db";
import User from "@/models/users";

const handler = async (req, res) => {
  await ConnectDb();

  switch (req.method) {
    case 'GET': // دریافت تمام کاربران
      try {
        const users = await User.find({})
          .select('-password') // عدم نمایش پسورد
          .sort({ createdAt: -1 }); // مرتب سازی بر اساس جدیدترین

        if (!users.length) {
          return res.status(200).json({ message: 'هنوز کاربری ثبت نشده است', data: [] });
        }

        return res.status(200).json({
          message: 'دریافت داده‌ها موفقیت آمیز بود',
          data: users,
          count: users.length
        });

      } catch (error) {
        console.error('خطا در دریافت کاربران:', error);
        return res.status(500).json({ error: 'خطای سرور داخلی' });
      }
      break;

    case 'POST':
      try {
        const { name, username, password } = req.body;

        if (!name || !username || !password) {
          return res.status(400).json({ error: 'تمام فیلدها الزامی هستند' });
        }

        const newUser = await User.create({
          name,
          username,
          password 
        });

        return res.status(201).json({
          message: 'کاربر با موفقیت ایجاد شد',
          user: {
            id: newUser._id,
            name: newUser.name,
            username: newUser.username,
          }
        });

      } catch (error) {
        console.error('خطا در ایجاد کاربر:', error);

        if (error.code === 11000) {
          return res.status(409).json({ error: 'نام کاربری قبلا استفاده شده است' });
        }

        return res.status(500).json({ error: 'خطای سرور داخلی' });
      }
      break;

    case 'DELETE':
      try {
        const { id } = req.query;


        if (!id) {
          return res.status(400).json({ error: 'شناسه کاربر الزامی است' });
        }

        const deletedUser = await User.findByIdAndDelete(id);

        if (!deletedUser) {
          return res.status(404).json({ error: 'کاربر یافت نشد' });
        }

        return res.status(200).json({
          message: 'کاربر با موفقیت حذف شد',
          user: {
            id: deletedUser._id,
            name: deletedUser.name,
            username: deletedUser.username
          }
        });

      } catch (error) {
        console.error('خطا در حذف کاربر:', error);
        return res.status(500).json({ error: 'خطای سرور داخلی' });
      }
      break;

    default:
      return res.status(405).json({ error: 'Method not allowed' });
  }
};

export default handler;