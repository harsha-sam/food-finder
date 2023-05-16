
import axios from 'axios';

async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      let result = await axios.post(
        'https://api.compassdigital.org/v1/user/guest/token',
        {
          realm: 'WEW9lgWk5oTkA98PNGEoc97J9Mdgy6foMM2',
        }
      );
      const { token } = result.data;
      result = await axios.get(
        `https://api.compassdigital.org/v1/location/multigroup/11J3gKPg8BCR3mr5OO92S6EBL4ddEAT17G44eoLPSw0N21gy4OHjQXjDG6LXIrL1MY8B5PHPX9omNMrqFJO`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const { groups } = result.data;
      const data = groups.map((group) => { 
        const { id, name, label: { en } } = group
        return {
          id, 
          name: en,
          shortName: name
        }
      })

      res.json(data);
    } catch (err) {
      res.status(400).json({
        error: err.message,
      });
    }
  }
}
export default handler;
