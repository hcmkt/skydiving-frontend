import { FC } from 'react';
import { Box, Text, Button } from '@chakra-ui/react';
import liff from '@line/liff';
import axios from 'axios';
import * as CONST from 'domains/constants';
import { isLocal } from 'domains/lib';
import { SubmitHandler, useForm, Controller } from 'react-hook-form';
import toast, { Toaster } from 'react-hot-toast';
import CheckboxUnit from 'components/molecules/CheckboxUnit';
import InputUnit from 'components/molecules/NumberUnit';
import RadioUnit from 'components/molecules/RadioUnit';

axios.defaults.baseURL = import.meta.env.VITE_API_URL;

interface FormData {
  reservationDays: string[];
  reservationTimes: string[];
  reservationCameras: string[];
  reservationVacancy: number;
  notification: string;
  notificationTimes: string[];
}

const From: FC = () => {
  const { register, handleSubmit, control } = useForm<FormData>({
    defaultValues: async () => {
      if (isLocal()) {
        return (await axios<FormData>('/settings')).data;
      } else {
        await liff.ready;
        const token = liff.getAccessToken();

        return (await axios<FormData>('/settings', { params: { token } })).data;
      }
    },
  });
  const onSubmit: SubmitHandler<FormData> = (settings) => {
    const payload = isLocal()
      ? settings
      : { token: liff.getAccessToken(), settings };
    void toast.promise(axios.put('/settings', payload), {
      loading: 'Loading',
      success: 'Success',
      error: 'Error',
    });
  };

  return (
    <Box w="100%" maxW="md" textAlign="center" mx="auto" px={4} py={2}>
      <Text fontSize="2xl" pb={4}>
        フォーム
      </Text>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Box pb={2}>
          <Text fontSize="xl" pb={2}>
            予約
          </Text>
          <Controller
            name="reservationDays"
            control={control}
            render={({ field: { onChange, value } }) => (
              <CheckboxUnit
                title="曜日"
                options={CONST.RESERVATION_DAYS}
                checkboxGroupProps={{ onChange, value }}
                mb={2}
              />
            )}
          />
          <Controller
            name="reservationTimes"
            control={control}
            render={({ field: { onChange, value } }) => (
              <CheckboxUnit
                title="時刻"
                options={CONST.RESERVATION_TIMES}
                checkboxGroupProps={{ onChange, value }}
                maxW="sm"
                mb={2}
              />
            )}
          />
          <Controller
            name="reservationCameras"
            control={control}
            render={({ field: { onChange, value } }) => (
              <CheckboxUnit
                title="カメラマン"
                options={CONST.RESERVATION_CAMERAS}
                checkboxGroupProps={{ onChange, value }}
                maxW={40}
                mb={2}
              />
            )}
          />
          <InputUnit
            title="最低枠数"
            registerReturn={register('reservationVacancy')}
            mb={2}
          />
        </Box>
        <Box pb={2}>
          <Text fontSize="xl" pb={2}>
            通知
          </Text>
          <Controller
            name="notification"
            control={control}
            render={({ field: { onChange, value } }) => (
              <RadioUnit
                title="通知"
                options={CONST.NOTIFICATION}
                radioGroupProps={{ onChange, value }}
                mb={2}
                maxW={40}
              />
            )}
          />
          <Controller
            name="notificationTimes"
            control={control}
            render={({ field: { onChange, value } }) => (
              <CheckboxUnit
                title="時刻"
                options={CONST.NOTIFICATION_TIMES}
                checkboxGroupProps={{ onChange, value }}
                maxW="340px"
                mb={2}
              />
            )}
          />
        </Box>
        <Button type="submit" colorScheme="blue">
          更新
        </Button>
      </form>
      <Toaster />
    </Box>
  );
};

export default From;
