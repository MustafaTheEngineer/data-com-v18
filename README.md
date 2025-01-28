# DEVELOPING A WEB APPLICATION TO SIMPLIFY CPE309 DATA COMMUNICATİON CONCEPTS

This is my graduation project. I made simulations for the data communication concepts.

## Signal Encoding Techniques
### Digital Signal to Digital Signal
![resim](https://github.com/user-attachments/assets/a62965ff-6ce5-46c8-9bc8-8576462da218)
Explanation of scenario:
1. User enters a binary data
2. User chooses an encoding scheme
3. Users may change the signal by clicking the white lines (possible signals)
After choosing an encoding scheme, users can change signal levels. In below image,
the signal above represents the signal sent by the sender while the image below
represents the signal received by the receiver.

### Digital Signal to Analog Signal
I developed digital signal to analog signal simulations.
![resim](https://github.com/user-attachments/assets/8a8a4430-692c-483a-aba2-5c276af0ce26)

Analog signal simulations are available for this methods:
Amplitude Shift Keying (ASK)
Binary Frequency Shift Keying (BFSK)
Multiple Frequency Shift Keying (MFSK)
Binary Phase Shift Keying (BPSK)
Differential Phase Shift Keying (DPSK)

### Analog Signal to Digital Signal
I developed a PCM simulation where users can decide on an analog signal and see the result of the digital signal of that analog signal.

![resim](https://github.com/user-attachments/assets/8af4a59d-0742-4a95-aa5c-f453385ef809)


## Signal Function Visualization
I developed a simulation where users can see the analog signals when the amplitude,
phase and frequency is changed. Also, users can see addition of these signals.
![resim](https://github.com/user-attachments/assets/1bc79ea9-afa4-4009-9b3f-e2be2c86894a)

![resim](https://github.com/user-attachments/assets/a205dfdc-1e99-4b01-9c84-b98ba7e88c6e)
The image shows the addition of signals from previous images. I used the svg
curve while drawing the single analog signals but the svg curve was not suitable for
the addition of signals because by the addition, the signal becomes complicated to
draw. So, I drew the addition signal by putting a dot for every x value.

## Error Detection
### Parity Checksum
I simulated parity checksum algorithm. In this scenario firstly the user enters a binary
data, then enters column number. If the value of column is 1, then a simple parity
check is applied. If it is 2, then 2D parity checksum is applied.

![resim](https://github.com/user-attachments/assets/69fe0b68-6684-4b6e-9f58-cafcde667409)

In the image above, the user enters binary data, then column number. Then by
clicking the bits, program will inform the user with one of these:
1. Data was sent correctly
2. The error from corrupted data detected and it is correctable
3. The error from corrupted data detected and it is not correctable
4. The error from corrupted data detected could not be detected

### Internet Checksum
I simulated internet checksum algorithm. In this scenario, the user enters
hexadecimal data, then enters the number which data will be divided to. The user
then uses the next and previous buttons to see the process step by step. The user can
corrupt and see the result of corrupted data.

### Cyclic Redundancy Check

I simulated CRC algorithm. In this scenario, the user enters data in binary format,
then enters the divider data in binary format. The user can use the next and previous
buttons to see how the CRC algorithm works step by step.

![resim](https://github.com/user-attachments/assets/8893d62a-4035-4fc0-8602-833b5ba62f09)

![resim](https://github.com/user-attachments/assets/b6b55c69-5f85-4ba5-a268-f01f1f3fb28f)

