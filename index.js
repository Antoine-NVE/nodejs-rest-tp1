const express = require('express');
const app = express();
app.use(express.json());

const parkings = require('./parkings');
const reservations = require('./reservations');

app.post('/parkings/:id/reservations', (req, res) => {
    // On récupère le parking correspondant à l'id
    const parking = parkings.find((parking) => parking.id === parseInt(req.params.id));
    if (!parking) {
        res.status(404).send('Parking not found');
    }

    // On récupère la réservation envoyée dans le body
    const reservation = {};
    reservation.id = reservations.length + 1;
    reservation.clientName = req.body.clientName;
    reservation.vehicle = req.body.vehicle;
    reservation.licensePlate = req.body.licensePlate;
    reservation.checkin = req.body.checkin;
    reservation.checkout = req.body.checkout;

    // On insère la réservation
    reservations.push(reservation);
    parking.reservations.push(reservation.id);

    // On renvoie les réservations du parking
    const parkingReservations = [];
    parking.reservations.forEach((reservationId) => {
        const reservation = reservations.find((reservation) => reservation.id === reservationId);
        parkingReservations.push(reservation);
    });
    res.status(201).json(parkingReservations);
});

app.get('/reservations', (req, res) => {
    res.status(200).json(reservations);
});

app.get('/reservations/:id', (req, res) => {
    // On récupère la réservation correspondant à l'id
    const reservation = reservations.find((reservation) => reservation.id === parseInt(req.params.id));
    if (!reservation) {
        res.status(404).send('Reservation not found');
    }
    res.status(200).json(reservation);
});

app.get('/parkings/:id/reservations', (req, res) => {
    // On récupère le parking correspondant à l'id
    const parking = parkings.find((parking) => parking.id === parseInt(req.params.id));
    if (!parking) {
        res.status(404).send('Parking not found');
    }

    // On vérifie si le parking a des réservations
    if (parking.reservations.length === 0) {
        res.status(404).send('No reservations');
    }

    // On renvoie les réservations du parking
    const parkingReservations = [];
    parking.reservations.forEach((reservationId) => {
        const reservation = reservations.find((reservation) => reservation.id === reservationId);
        parkingReservations.push(reservation);
    });
    res.status(200).json(parkingReservations);
});

app.put('/reservations/:id', (req, res) => {
    // On récupère la réservation correspondant à l'id
    const reservation = reservations.find((reservation) => reservation.id === parseInt(req.params.id));
    if (!reservation) {
        res.status(404).send('Reservation not found');
    }

    // On met à jour la réservation
    reservation.clientName = req.body.clientName;
    reservation.vehicle = req.body.vehicle;
    reservation.licensePlate = req.body.licensePlate;
    reservation.checkin = req.body.checkin;
    reservation.checkout = req.body.checkout;

    res.status(200).json(reservation);
});

app.delete('/parkings/:id/reservations/:id2', (req, res) => {
    // On récupère le parking correspondant à l'id
    const parking = parkings.find((parking) => parking.id === parseInt(req.params.id));
    if (!parking) {
        res.status(404).send('Parking not found');
    }
    if (parking.reservations.length === 0) {
        res.status(404).send('No reservations');
    }
    if (!parking.reservations.includes(parseInt(req.params.id2))) {
        res.status(404).send('Reservation not found');
    }

    // On supprime la réservation
    parking.reservations = parking.reservations.filter((reservationId) => reservationId !== parseInt(req.params.id2));
    reservations.splice(
        reservations.findIndex((reservation) => reservation.id === parseInt(req.params.id2)),
        1
    );

    // On renvoie les réservations du parking
    const parkingReservations = [];
    parking.reservations.forEach((reservationId) => {
        const reservation = reservations.find((reservation) => reservation.id === reservationId);
        parkingReservations.push(reservation);
    });
    if (parkingReservations.length === 0) {
        res.status(404).send('No reservations');
    }
    res.status(200).json(parkingReservations);
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
