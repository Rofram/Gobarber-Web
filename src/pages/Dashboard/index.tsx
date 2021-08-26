import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { isToday, format, parseISO, isAfter } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';
import DayPicker, { DayModifiers } from 'react-day-picker';
import 'react-day-picker/lib/style.css';

import { FiClock, FiPower } from 'react-icons/fi';
import { useAuth } from '../../hooks/Auth';

import * as S from './styles';

import logoImg from '../../assets/Logo.svg';
import api from '../../services/api';

interface MonthAvailability {
  day: number;
  available: boolean;
}

interface Appointment {
  id: string;
  date: string;
  hourFormatted: string;
  user: {
    name: string;
    avatar_url: string;
  };
}

const Dashboard: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const [monthAvailability, setMonthAvailability] = useState<MonthAvailability[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);

  const { signOut, user } = useAuth();

  const handleDateChange = useCallback((day: Date, modifiers: DayModifiers) => {
    if (modifiers.available && !modifiers.disabled) {
      setSelectedDate(day);
    }
  }, []);

  const handleMonthChange = useCallback((month: Date) => {
    setCurrentMonth(month);
  }, []);

  useEffect(() => {
    api
      .get(`/providers/${user.id}/month-availability`, {
        params: {
          month: currentMonth.getMonth() + 1,
          year: currentMonth.getFullYear(),
        },
      })
      .then((response) => {
        setMonthAvailability(response.data);
      });
  }, [currentMonth, user.id]);

  useEffect(() => {
    api
      .get<Appointment[]>('/appointments/me', {
        params: {
          day: selectedDate.getDate(),
          month: selectedDate.getMonth() + 1,
          year: selectedDate.getFullYear(),
        },
      })
      .then((response) => {
        const appointmentsFormatted = response.data.map((appointment) => {
          const date = parseISO(appointment.date);
          const hour = format(date, 'HH:mm');
          return {
            ...appointment,
            hourFormatted: hour,
          };
        });

        setAppointments(appointmentsFormatted);
      });
  }, [selectedDate]);

  const disabledDays = useMemo(() => {
    const dates = monthAvailability
      .filter((monthDay) => monthDay.available === false)
      .map((monthDay) => {
        const month = currentMonth.getMonth();
        const year = currentMonth.getFullYear();
        return new Date(year, month, monthDay.day);
      });

    return dates;
  }, [currentMonth, monthAvailability]);

  const selectedDayAsText = useMemo(() => {
    return format(selectedDate, "'Dia' dd  'de' MMMM", {
      locale: ptBR,
    });
  }, [selectedDate]);

  const selectedWeekDayAsText = useMemo(() => {
    return format(selectedDate, 'cccc', {
      locale: ptBR,
    });
  }, [selectedDate]);

  const morningAppointments = useMemo(() => {
    return appointments.filter((appointment) => {
      return parseISO(appointment.date).getHours() < 12;
    });
  }, [appointments]);

  const afternoonAppointments = useMemo(() => {
    return appointments.filter((appointment) => {
      return parseISO(appointment.date).getHours() >= 12;
    });
  }, [appointments]);

  const nextAppointments = useMemo(() => {
    return appointments.find((appointment) => isAfter(parseISO(appointment.date), new Date()));
  }, [appointments]);

  return (
    <S.Container>
      <S.Header>
        <S.HeaderContent>
          <img src={logoImg} alt="logo GoBarber" />
          <S.Profile>
            <img
              src={
                user.avatar_url
                  ? user.avatar_url
                  : 'https://avatars.githubusercontent.com/u/50988834?v=4'
              }
              alt="Rodrigo de França"
            />
            <div>
              <span>Bem-vindo</span>
              <strong>{user.name}</strong>
            </div>
          </S.Profile>

          <button type="button" onClick={signOut}>
            <FiPower />
          </button>
        </S.HeaderContent>
      </S.Header>

      <S.Content>
        <S.Schedule>
          <h1>Horários agendados</h1>
          <p>
            {isToday(selectedDate) && <span>Hoje</span>}
            <span>{selectedDayAsText}</span>
            <span>{selectedWeekDayAsText}</span>
          </p>

          {isToday(selectedDate) && nextAppointments && (
            <S.NextAppointment>
              <strong>Agendamento a seguir</strong>
              <div>
                <img src={nextAppointments.user.avatar_url} alt={nextAppointments.user.name} />

                <strong>{nextAppointments.user.name}</strong>
                <span>
                  <FiClock />
                  <span>{nextAppointments.hourFormatted}</span>
                </span>
              </div>
            </S.NextAppointment>
          )}

          <S.Section>
            <strong>Manhã</strong>

            {morningAppointments.length === 0 && <p>Nenhum agendamento neste período</p>}

            {morningAppointments.map((appointment) => (
              <S.Appointment key={appointment.id}>
                <span>
                  <FiClock />
                  <span>{appointment.hourFormatted}</span>
                </span>
                <div>
                  <img src={appointment.user.avatar_url} alt={appointment.user.name} />
                  <strong>{appointment.user.name}</strong>
                </div>
              </S.Appointment>
            ))}
          </S.Section>

          <S.Section>
            <strong>Tarde</strong>

            {afternoonAppointments.length === 0 && <p>Nenhum agendamento neste período</p>}

            {afternoonAppointments.map((appointment) => (
              <S.Appointment key={appointment.id}>
                <span>
                  <FiClock />
                  <span>{appointment.hourFormatted}</span>
                </span>
                <div>
                  <img src={appointment.user.avatar_url} alt={appointment.user.name} />
                  <strong>{appointment.user.name}</strong>
                </div>
              </S.Appointment>
            ))}
          </S.Section>
        </S.Schedule>
        <S.Calendar>
          <DayPicker
            weekdaysShort={['D', 'S', 'T', 'Q', 'Q', 'S', 'S']}
            fromMonth={new Date()}
            modifiers={{
              available: { daysOfWeek: [1, 2, 3, 4, 5] },
            }}
            disabledDays={[
              {
                daysOfWeek: [0, 6],
              },
              ...disabledDays,
            ]}
            selectedDays={selectedDate}
            onDayClick={handleDateChange}
            onMonthChange={handleMonthChange}
            months={[
              'Janeiro',
              'Fevereiro',
              'Março',
              'Abril',
              'Maio',
              'Junho',
              'Julho',
              'Agosto',
              'Setembro',
              'Outubro',
              'Novembro',
              'Dezembro',
            ]}
          />
        </S.Calendar>
      </S.Content>
    </S.Container>
  );
};

export default Dashboard;
